import assert from 'node:assert/strict';
import { mkdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { chromium } from 'playwright';
import { root } from './build.mjs';

const port = Number(process.env.TEST_PORT || 4187);
const server = spawn(process.execPath, ['scripts/serve.mjs'], { cwd: root, env: { ...process.env, PORT: String(port) }, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
let output = '';
server.stdout.on('data', (data) => { output += data; });
server.stderr.on('data', (data) => { output += data; });
let browser;
try {
  for (let attempt = 0; attempt < 100; attempt++) {
    if (output.includes('Preview:')) break;
    if (server.exitCode !== null) throw new Error(`Preview failed: ${output}`);
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  assert.ok(output.includes('Preview:'), `Preview not ready: ${output}`);
  const info = JSON.parse(await readFile(path.join(root, 'dist/build-info.json'), 'utf8'));
  const config = JSON.parse(await readFile(path.join(root, 'site/config.json'), 'utf8'));
  const base = `http://127.0.0.1:${port}${info.basePath}/`;
  const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
  const executablePath = process.env.BROWSER_PATH || (existsSync(edge) ? edge : undefined);
  browser = await chromium.launch({ headless: true, executablePath });
  await mkdir(path.join(root, '.preview'), { recursive: true });
  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }, { width: 320, height: 740 }]) {
    const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    const failedRequests = [];
    page.on('requestfailed', (request) => failedRequests.push(request.url()));
    for (const route of ['', ...config.articles.map((article) => `articles/${article.slug}/`), 'about/']) {
      const response = await page.goto(`${base}${route}`);
      assert.equal(response.status(), 200, route);
      assert.equal(await page.locator('h1').count(), 1, route);
      assert.ok(await page.locator('#main').isVisible());
      const dimensions = await page.evaluate(() => ({ client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }));
      assert.ok(dimensions.scroll <= dimensions.client + 1, `${viewport.width}px ${route}: horizontal overflow ${JSON.stringify(dimensions)}`);
      if (!route) {
        assert.equal(await page.locator('.chapter-card').count(), 10);
        await page.screenshot({ path: path.join(root, `.preview/home-${viewport.width}.png`), fullPage: true });
        await page.getByRole('link', { name: '从第一篇开始' }).click();
        await page.waitForURL('**/articles/what-is-network-proxy/');
      }
      if (route === 'articles/proxy-vpn-tor/') {
        assert.ok(await page.locator('.table-wrap').isVisible());
        if (viewport.width <= 640) {
          await page.locator('.mobile-outline summary').click();
          assert.ok(await page.locator('.mobile-outline nav').isVisible());
          await page.locator('.mobile-outline summary').click();
        }
        await page.screenshot({ path: path.join(root, `.preview/article-${viewport.width}.png`), fullPage: true });
        await page.locator('.article-pagination a').last().click();
        await page.waitForURL('**/articles/proxy-ecosystem/');
      }
    }
    const missing = await page.goto(`${base}does-not-exist/`);
    assert.equal(missing.status(), 404);
    assert.ok(await page.getByRole('heading', { name: '这条路，暂时没有内容。' }).isVisible());
    assert.deepEqual(errors, [], 'Browser JS errors');
    assert.deepEqual(failedRequests, [], 'Failed resource requests');
    await context.close();
    console.log(`Browser passed: ${viewport.width}px, 12 pages, navigation, no overflow, no script errors.`);
  }
  const noScript = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await noScript.newPage();
  await page.goto(`${base}articles/what-is-network-proxy/`);
  assert.ok(await page.locator('.prose').isVisible());
  await page.locator('.mobile-outline summary').click();
  assert.ok(await page.locator('.mobile-outline nav').isVisible());
  await page.locator('.article-pagination a').last().click();
  await page.waitForURL('**/articles/proxy-vpn-tor/');
  await noScript.close();
  console.log('Browser passed: JavaScript disabled, mobile directory and article navigation.');
} finally {
  if (browser) await browser.close();
  server.kill();
}
