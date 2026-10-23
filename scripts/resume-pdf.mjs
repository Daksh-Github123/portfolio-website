// Renders public/resume/index.html to public/Daksh_Singh_Resume.pdf with headless Chromium.
// Serves public/ on a local port so absolute /css and /fonts paths resolve exactly as in production.
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname, normalize } from 'node:path';
import { chromium } from 'playwright-core';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = join(root, 'public');
const { meta } = JSON.parse(readFileSync(join(root, 'data', 'resume.json'), 'utf8'));

const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2' };
const server = createServer((req, res) => {
  let p = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname));
  let file = join(pub, p);
  if (!file.startsWith(pub)) return res.writeHead(403).end();
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  if (!existsSync(file)) return res.writeHead(404).end();
  res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream' });
  res.end(readFileSync(file));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const port = server.address().port;

const executablePath = process.env.CHROMIUM_PATH || findChromium();
const browser = await chromium.launch({ executablePath });
const page = await browser.newPage();
await page.goto(`http://127.0.0.1:${port}/resume/`, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
const out = join(pub, meta.pdfFile);
await page.pdf({ path: out, format: 'Letter', printBackground: false, preferCSSPageSize: true, tagged: true });
await browser.close();
server.close();
console.log(`wrote public/${meta.pdfFile} (${Math.round(statSync(out).size / 1024)} KB)`);

function findChromium() {
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
  for (const c of [join(base, 'chromium'), join(base, 'chromium-1194', 'chrome-linux', 'chrome')]) {
    if (existsSync(c) && statSync(c).isFile()) return c;
  }
  throw new Error('Chromium not found; set CHROMIUM_PATH');
}
