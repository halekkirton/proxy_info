import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { outputDirectory, root, sourceDirectory } from './build.mjs';

const info = JSON.parse(await readFile(path.join(outputDirectory, 'build-info.json'), 'utf8'));
assert.equal(info.articles, 1, 'Expected the first published article');
assert.equal(info.pages.length, 3, 'Expected homepage, first article and about');
const documents = [...info.pages.map((route) => `${route}index.html`), '404.html'];
const htmlByPath = new Map();
const config = JSON.parse(await readFile(path.join(root, 'site/config.json'), 'utf8'));
for (const article of config.articles) {
  const source = await readFile(path.join(sourceDirectory, article.file), 'utf8');
  const sections = source.split(/^## (?:参考资料|官方入口)\s*$/m);
  assert.equal(sections.length, 2, `${article.file}: expected sources section`);
  assert.ok(/\]\(https:\/\//.test(sections[1]), `${article.file}: missing clickable source`);
  const referenceNumbers = new Set([...sections[1].matchAll(/\[(\d+)\]/g)].map((match) => match[1]));
  for (const match of sections[0].matchAll(/\[(\d+)\]/g)) assert.ok(referenceNumbers.has(match[1]), `${article.file}: unmatched citation [${match[1]}]`);
}
for (const file of documents) htmlByPath.set(file, await readFile(path.join(outputDirectory, file), 'utf8'));
let checkedLinks = 0;

for (const [file, html] of htmlByPath) {
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1, `${file}: expected one h1`);
  assert.ok(html.includes('lang="zh-CN"'), `${file}: missing language`);
  assert.ok(html.includes('<meta name="description"'), `${file}: missing description`);
  assert.ok(html.includes('id="main"'), `${file}: missing skip-link target`);
  assert.ok(!html.includes('\uFFFD'), `${file}: invalid UTF-8 replacement character`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(ids.length, new Set(ids).size, `${file}: duplicate IDs`);
  if (file.startsWith('articles/')) {
    assert.ok(html.includes('article-pagination'), `${file}: missing pagination`);
    assert.ok(html.includes('application/ld+json'), `${file}: missing article data`);
    assert.ok(html.includes('本文目录'), `${file}: missing contents`);
    assert.ok(html.includes('参考资料') || html.includes('官方入口'), `${file}: missing sources`);
  }
  const currentUrl = `https://preview.test${info.basePath}/${file.replace(/index\.html$/, '')}`;
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const attribute = match[1].replaceAll('&amp;', '&');
    if (/^(?:https?:|mailto:|data:)/.test(attribute)) continue;
    const url = new URL(attribute, currentUrl);
    assert.ok(!info.basePath || url.pathname.startsWith(`${info.basePath}/`), `${file}: link escaped base path: ${attribute}`);
    const relative = decodeURIComponent(url.pathname.slice(info.basePath.length + 1));
    const target = relative.endsWith('/') || !relative ? `${relative}index.html` : relative;
    assert.ok((await stat(path.join(outputDirectory, target))).isFile(), `${file}: missing ${attribute}`);
    if (url.hash && htmlByPath.has(target)) {
      const fragment = decodeURIComponent(url.hash.slice(1));
      assert.ok(htmlByPath.get(target).includes(`id="${fragment}"`), `${file}: missing anchor ${attribute}`);
    }
    checkedLinks++;
  }
}

if (info.siteUrl) {
  const sitemap = await readFile(path.join(outputDirectory, 'sitemap.xml'), 'utf8');
  assert.equal((sitemap.match(/<loc>/g) || []).length, 3);
  assert.ok(sitemap.includes(`${info.siteUrl}/articles/`));
}
console.log(`Passed: ${documents.length} HTML pages, ${checkedLinks} internal links, headings, references, metadata and base path.`);
