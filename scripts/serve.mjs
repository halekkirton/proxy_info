import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { watch } from 'node:fs';
import path from 'node:path';
import { build, outputDirectory, root } from './build.mjs';

await build();
const info = JSON.parse(await readFile(path.join(outputDirectory, 'build-info.json'), 'utf8'));
const port = Number(process.env.PORT || 4173);
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.json': 'application/json; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8' };

export function serve() {
  const server = createServer(async (request, response) => {
    try {
      let pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      if (info.basePath) {
        if (pathname === '/' || pathname === info.basePath) {
          response.writeHead(302, { Location: `${info.basePath}/` }).end();
          return;
        }
        if (!pathname.startsWith(`${info.basePath}/`)) {
          response.writeHead(404).end('Not found');
          return;
        }
        pathname = pathname.slice(info.basePath.length);
      }
      let target = path.resolve(outputDirectory, `.${pathname}`);
      if (!target.startsWith(`${outputDirectory}${path.sep}`) && target !== outputDirectory) {
        response.writeHead(403).end('Forbidden');
        return;
      }
      let status = 200;
      try {
        const details = await stat(target);
        if (details.isDirectory()) {
          if (!pathname.endsWith('/')) {
            response.writeHead(301, { Location: `${info.basePath}${pathname}/` }).end();
            return;
          }
          target = path.join(target, 'index.html');
        }
        await stat(target);
      } catch {
        target = path.join(outputDirectory, '404.html');
        status = 404;
      }
      response.writeHead(status, { 'Content-Type': mime[path.extname(target)] || 'application/octet-stream', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
      response.end(await readFile(target));
    } catch {
      response.writeHead(400).end('Bad request');
    }
  });
  server.on('error', (error) => { console.error(error.message); process.exitCode = 1; });
  server.listen(port, '127.0.0.1', () => console.log(`Preview: http://127.0.0.1:${port}${info.basePath}/`));
  return server;
}

serve();
if (process.argv.includes('--watch')) {
  let timer;
  let building = false;
  let queued = false;
  const rebuild = async () => {
    if (building) { queued = true; return; }
    building = true;
    try { await build(); } catch (error) { console.error(error); }
    building = false;
    if (queued) { queued = false; await rebuild(); }
  };
  for (const directory of ['site', 'github_article']) {
    watch(path.join(root, directory), { recursive: true }, () => {
      clearTimeout(timer);
      timer = setTimeout(rebuild, 180);
    });
  }
  console.log('Watching Markdown and site files. Refresh the browser after changes.');
}
