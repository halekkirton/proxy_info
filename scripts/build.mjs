import { cp, mkdir, readFile, rm, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import MarkdownIt from 'markdown-it';

export const root = fileURLToPath(new URL('../', import.meta.url));
export const sourceDirectory = path.join(root, 'github_article/代理工具生态入门系列-最终版');
export const outputDirectory = path.join(root, 'dist');
export const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);

export async function build() {
  const config = JSON.parse(await readFile(path.join(root, 'site/config.json'), 'utf8'));
  const siteUrl = process.env.SITE_URL?.replace(/\/$/, '') || '';
  const basePath = (process.env.BASE_PATH ?? (siteUrl ? new URL(siteUrl).pathname : '')).replace(/\/$/, '');
  if (basePath && (!basePath.startsWith('/') || basePath.includes('..'))) throw new Error('BASE_PATH must be an absolute URL path without traversal.');
  const href = (route = '') => `${basePath}/${route.replace(/^\//, '')}`;
  const articleHref = (article) => href(`articles/${article.slug}/`);
  const number = (index) => String(index + 1).padStart(2, '0');
  const markdown = new MarkdownIt({ html: false, linkify: false, typographer: false });
  const articles = await Promise.all(config.articles.map(async (article, index) => {
    const source = await readFile(path.join(sourceDirectory, article.file), 'utf8');
    const title = source.match(/^# (.+)$/m)?.[1];
    if (!title) throw new Error(`Missing title: ${article.file}`);
    const words = source.replace(/https?:\/\/\S+/g, '').length;
    return { ...article, title, index, minutes: Math.max(2, Math.ceil(words / 420)), source };
  }));
  if (new Set(articles.map((article) => article.slug)).size !== articles.length) throw new Error('Duplicate article slug.');

  const icon = '<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M7 8h8c4 0 5 4 9 4M7 16h18M7 24h8c4 0 5-4 9-4" stroke="currentColor" stroke-width="2"/><circle cx="7" cy="8" r="3" fill="currentColor"/><circle cx="25" cy="12" r="3" fill="currentColor"/><circle cx="7" cy="24" r="3" fill="currentColor"/><circle cx="25" cy="20" r="3" fill="currentColor"/></svg>';
  const footer = `<footer class="site-footer"><div><a class="footer-brand" href="${href()}">${escapeHtml(config.name)}</a><p>先理解，再选择。让每一次连接都有据可循。</p></div><div class="footer-links"><a href="${href('about/')}">关于与使用边界</a><a href="#top">回到顶部 ↑</a></div><p class="footer-note">独立科普手册 · 科普内容与服务信息分开 · 内容复核 ${config.reviewed}</p></footer>`;
  function layout({ title, description, route, content, active = '', article = false, noindex = false }) {
    const canonical = siteUrl && !noindex ? `${siteUrl}/${route}` : '';
    const structured = article ? { '@context': 'https://schema.org', '@type': 'Article', headline: title, description, inLanguage: 'zh-CN', dateModified: config.reviewed, ...(canonical ? { mainEntityOfPage: canonical } : {}) } : null;
    return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(title)}${route ? ` · ${escapeHtml(config.shortName)}` : ''}</title><meta name="description" content="${escapeHtml(description)}"><meta name="theme-color" content="#123f35">${noindex ? '<meta name="robots" content="noindex">' : ''}${canonical ? `<link rel="canonical" href="${escapeHtml(canonical)}"><meta property="og:url" content="${escapeHtml(canonical)}">` : ''}<meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:type" content="${article ? 'article' : 'website'}"><meta property="og:locale" content="zh_CN"><meta property="og:site_name" content="${escapeHtml(config.name)}"><meta name="twitter:card" content="summary"><meta name="twitter:title" content="${escapeHtml(title)}"><meta name="twitter:description" content="${escapeHtml(description)}"><link rel="icon" href="${href('assets/favicon.svg')}" type="image/svg+xml"><link rel="stylesheet" href="${href('assets/style.css')}">${structured ? `<script type="application/ld+json">${JSON.stringify(structured).replace(/</g, '\\u003c')}</script>` : ''}<script src="${href('assets/site.js')}" defer></script></head><body id="top"><a class="skip-link" href="#main">跳到正文</a><header class="site-header"><div class="header-inner"><a class="brand" href="${href()}"><span class="brand-icon">${icon}</span><span>${escapeHtml(config.name)}<small>THE NETWORK FIELD GUIDE</small></span></a><nav aria-label="主导航"><a ${active === 'home' ? 'aria-current="page"' : ''} href="${href()}">首页</a><a href="${href('#chapters')}">阅读目录</a><a ${active === 'about' ? 'aria-current="page"' : ''} href="${href('about/')}">关于</a></nav></div></header>${content}${footer}</body></html>`;
  }
  const promotion = config.promotion;
  if (promotion?.url && (new URL(promotion.url).protocol !== 'https:' || new URL(promotion.url).hostname !== 'github.com')) throw new Error('Promotion URL must be an HTTPS GitHub page.');
  const serviceNote = `<section class="service-note" aria-label="机场与订阅服务"><p class="eyebrow">NEXT STEP</p><h2>了解工具之后，再选择连接服务。</h2><p>${escapeHtml(promotion?.description || '')}</p>${promotion?.url ? `<a class="button button-primary" href="${escapeHtml(promotion.url)}" rel="sponsored">${escapeHtml(promotion.label)} ↗</a><p class="service-destination">前往 GitHub 查看服务信息</p>` : `<p class="service-destination">机场与订阅服务整理将在 GitHub 发布，目前尚未开放入口。</p>`}</section>`;
  const card = (article) => `<a class="chapter-card" href="${articleHref(article)}"><span class="chapter-number">${number(article.index)}</span><div><h3>${escapeHtml(article.label)}</h3><p>${escapeHtml(article.summary)}</p><span class="card-meta">${article.minutes} 分钟阅读 <span aria-hidden="true">↗</span></span></div></a>`;
  const chapterGroups = config.groups.filter((group) => articles.some((article) => article.group === group.id)).map((group, groupIndex) => `<section class="chapter-group" aria-labelledby="group-${group.id}"><div class="group-heading"><span class="eyebrow">PART ${number(groupIndex)}</span><h2 id="group-${group.id}">${group.name}</h2><p>${group.description}</p></div><div class="chapter-grid">${articles.filter((article) => article.group === group.id).map(card).join('')}</div></section>`).join('');
  const home = `<main id="main"><section class="hero"><div class="hero-copy"><p class="eyebrow"><span class="status-dot"></span> 一本写给普通人的网络手册</p><h1>名字很多，<br>先把<span>关系</span>弄清楚。</h1><p class="hero-description">代理、VPN、Tor，Clash、V2Ray、Xray……<br>不用急着下载软件。从基础概念开始，<br class="desktop-break">读懂工具如何工作，也知道它的边界。</p><div class="hero-actions"><a class="button button-primary" href="${articleHref(articles[0])}">从第一篇开始 <span aria-hidden="true">↗</span></a><a class="text-link" href="#chapters">浏览全部文章 <span aria-hidden="true">↓</span></a></div><div class="hero-stats"><span><strong>1</strong> 篇入门文章</span><span><strong>1</strong> 个学习阶段</span><span>先懂原理 · 再选服务</span></div></div><div class="network-map" aria-label="网络工具五层关系示意"><div class="map-caption"><span>一张小地图</span><span>01 — 05</span></div><div class="map-path"><div class="map-node"><b>01</b><span>客户端<small>你操作的界面</small></span><em>CLIENT</em></div><div class="map-node"><b>02</b><span>核心<small>实际执行连接</small></span><em>CORE</em></div><div class="map-node"><b>03</b><span>协议<small>彼此通信的规则</small></span><em>PROTOCOL</em></div><div class="map-node"><b>04</b><span>配置<small>把参数组合起来</small></span><em>CONFIG</em></div><div class="map-node"><b>05</b><span>服务 / 节点<small>连接的远程入口</small></span><em>SERVICE</em></div></div><p class="map-footnote"><span aria-hidden="true">↳</span> 分清角色，比记住名字更重要。<small>概念关系示意，不代表数据包的实际经过顺序。</small></p></div></section><section class="chapters section-shell" id="chapters"><div class="section-title"><div><p class="eyebrow">READ AT YOUR OWN PACE</p><h2>从概念，到判断。</h2></div><p>可以从头读，也可以只解决眼前的问题。<br>没有需要背下来的协议排行榜。</p></div>${chapterGroups}</section></main>`;
  const pages = [{ route: '', html: layout({ title: config.seoTitle || config.name, description: config.description, route: '', content: home, active: 'home' }) }];

  for (const article of articles) {
    const tokens = markdown.parse(article.source.replace(/^# .+\r?\n/, ''), {});
    const headings = [];
    const seen = new Map();
    tokens.forEach((token, index) => {
      if (token.type !== 'heading_open') return;
      const text = tokens[index + 1].content;
      const stem = text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '') || 'section';
      const count = seen.get(stem) || 0;
      seen.set(stem, count + 1);
      const id = `${stem}${count ? `-${count + 1}` : ''}`;
      token.attrSet('id', id);
      if (token.tag === 'h2' || token.tag === 'h3') headings.push({ text, id, level: token.tag });
    });
    const body = markdown.renderer.render(tokens, markdown.options, {}).replace(/<table>/g, '<div class="table-wrap" role="region" aria-label="对比表格，可横向滚动" tabindex="0"><table>').replace(/<\/table>/g, '</table></div>');
    const toc = `<ol>${headings.map((heading) => `<li class="toc-${heading.level}"><a href="#${heading.id}">${escapeHtml(heading.text)}</a></li>`).join('')}</ol>`;
    const sideNav = config.groups.filter((group) => articles.some((article) => article.group === group.id)).map((group) => `<div class="sidebar-group"><p>${group.name}</p>${articles.filter((item) => item.group === group.id).map((item) => `<a ${item.slug === article.slug ? 'aria-current="page"' : ''} href="${articleHref(item)}"><span>${number(item.index)}</span>${escapeHtml(item.label)}</a>`).join('')}</div>`).join('');
    const previous = articles[article.index - 1];
    const next = articles[article.index + 1];
    const content = `<div class="reading-progress" aria-hidden="true"><span></span></div><div class="article-shell"><aside class="series-sidebar" aria-label="系列目录"><a class="back-link" href="${href('#chapters')}">← 全部文章</a><p class="eyebrow">THE FIELD GUIDE / 1 PUBLISHED CHAPTER</p><nav aria-label="章节导航">${sideNav}</nav></aside><main class="article-main" id="main"><nav class="breadcrumbs" aria-label="当前位置"><a href="${href()}">首页</a><span>/</span><a href="${href(`#group-${article.group}`)}">${config.groups.find((group) => group.id === article.group).name}</a><span>/</span><span>第 ${number(article.index)} 篇</span></nav><header class="article-header"><p class="eyebrow">CHAPTER ${number(article.index)} <span> / ${articles.length}</span></p><h1>${escapeHtml(article.title)}</h1><p class="article-summary">${escapeHtml(article.summary)}</p><div class="article-meta"><span>约 ${article.minutes} 分钟阅读</span><span>内容复核 <time datetime="${config.reviewed}">${config.reviewed.replaceAll('-', '.')}</time></span></div></header><details class="mobile-outline"><summary>阅读导航：系列目录与本文目录</summary><nav aria-label="手机章节导航">${sideNav}</nav><p class="eyebrow">本文目录</p>${toc}</details><article class="prose">${body}</article>${['config-subscriptions', 'tool-security'].includes(article.slug) ? serviceNote : ''}<div class="article-caution">本文为一般性科普，不构成服务推荐或法律意见。项目支持范围会变化，使用前请核对官方文档及所在地规则。</div><nav class="article-pagination" aria-label="上一篇与下一篇">${previous ? `<a href="${articleHref(previous)}"><small>← 上一篇 · ${number(previous.index)}</small><strong>${escapeHtml(previous.label)}</strong></a>` : `<a href="${href('#chapters')}"><small>← 阅读目录</small><strong>查看全部文章</strong></a>`}${next ? `<a href="${articleHref(next)}"><small>下一篇 · ${number(next.index)} →</small><strong>${escapeHtml(next.label)}</strong></a>` : `<a href="${href('about/')}"><small>读完以后 →</small><strong>关于本手册与内容纠错</strong></a>`}</nav></main><aside class="toc-sidebar" aria-label="本文目录"><p class="eyebrow">ON THIS PAGE</p><h2>本文目录</h2><nav>${toc}</nav><div class="toc-note">不急着换工具，<br>先弄清楚问题。</div></aside></div>`;
    pages.push({ route: `articles/${article.slug}/`, html: layout({ title: article.title, description: article.description || article.summary, route: `articles/${article.slug}/`, content, article: true }) });
  }

  const aboutSource = await readFile(path.join(root, 'site/about.md'), 'utf8');
  const about = `<main class="about-shell" id="main"><header class="article-header"><p class="eyebrow">ABOUT THIS FIELD GUIDE</p><h1>把复杂的名字，<br>放回清楚的关系里。</h1><p class="article-summary">这本手册不是软件排行榜，也不是节点推荐页。</p></header><article class="prose">${markdown.render(aboutSource)}</article><a class="button button-primary" href="${href('#chapters')}">回到阅读目录 ↗</a></main>`;
  pages.push({ route: 'about/', html: layout({ title: '关于本手册与使用边界', description: config.aboutDescription || '本站的写作方法、事实来源、隐私说明和内容纠错方式。', route: 'about/', content: about, active: 'about' }) });
  if (path.resolve(outputDirectory) !== path.join(root, 'dist')) throw new Error('Unexpected output directory.');
  await rm(outputDirectory, { recursive: true, force: true });
  for (const page of pages) {
    const directory = path.join(outputDirectory, page.route);
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, 'index.html'), page.html);
  }
  await cp(path.join(root, 'site/assets'), path.join(outputDirectory, 'assets'), { recursive: true });
  await writeFile(path.join(outputDirectory, '404.html'), layout({ title: '这一页还没有收录', description: '页面不存在，请返回阅读目录。', route: '404.html', noindex: true, content: `<main class="not-found" id="main"><p class="eyebrow">404 / WRONG TURN</p><h1>这条路，暂时没有内容。</h1><p>页面可能移动了，也可能是地址少写了几个字。</p><a class="button button-primary" href="${href()}">返回首页 ↗</a></main>` }));
  await writeFile(path.join(outputDirectory, '.nojekyll'), '');
  await writeFile(path.join(outputDirectory, 'robots.txt'), `User-agent: *\nAllow: /\n${siteUrl ? `Sitemap: ${siteUrl}/sitemap.xml\n` : ''}`);
  if (siteUrl) await writeFile(path.join(outputDirectory, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map((page) => `<url><loc>${escapeHtml(`${siteUrl}/${page.route}`)}</loc></url>`).join('')}</urlset>`);
  else await unlink(path.join(outputDirectory, 'sitemap.xml')).catch((error) => { if (error.code !== 'ENOENT') throw error; });
  await writeFile(path.join(outputDirectory, 'build-info.json'), JSON.stringify({ basePath, siteUrl, articles: articles.length, pages: pages.map((page) => page.route) }, null, 2));
  console.log(`Built ${pages.length} pages + 404 → dist (base: ${basePath || '/'})`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await build();
