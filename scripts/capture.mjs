// Renders the /shots capture gallery with headless Chromium and exports the
// final shot PNGs (3x DPR) plus the OG image (1200x630).
//
// Usage:
//   npm run build
//   npm i --no-save playwright && npx playwright install chromium
//   node scripts/capture.mjs [outDir]     # default: ./finals
//
// playwright is deliberately NOT a package.json dependency — it would bloat
// the Docker image build (`npm ci`). Install it ad hoc as above.

import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.resolve(process.argv[2] ?? path.join(root, 'finals'));
mkdirSync(outDir, { recursive: true });

const PORT = 4173;
const server = spawn('python3', ['-m', 'http.server', String(PORT)], {
  cwd: path.join(root, 'dist'),
  stdio: 'ignore',
});
await new Promise((r) => setTimeout(r, 800));

const base = `http://127.0.0.1:${PORT}`;

// [selector on /shots, output file, options]
const shots = [
  ['#shot-01 .phone', 'shot-01-hero-dark.png'],
  ['#shot-01b .phone', 'shot-01b-hero-light.png'],
  ['#shot-02 .tg-card', 'shot-02-fleet-list.png'],
  ['#shot-03 .tg-card', 'shot-03-marko.png'],
  ['#shot-04 .tg-card', 'shot-04-progress-card.png'],
  ['#shot-05 .tg-body', 'shot-05-approval-card.png'],
  ['#shot-06 .tg-card', 'shot-06-rich-reply.png'],
  ['#shot-07 .tg-body', 'shot-07-quota.png'],
  ['#shot-08 .tg-card', 'shot-08-rich-showcase.png'],
  ['#shot-leash .leash-step:nth-child(1) .tg-card', 'shot-09-leash-ask.png'],
  ['#shot-leash .leash-step:nth-child(2) .tg-body', 'shot-10-leash-card.png'],
  ['#shot-leash .leash-step:nth-child(3) .tg-body', 'shot-11-leash-approved.png'],
  ['#shot-12 .tg-card', 'shot-12-og-inset.png'],
];

const browser = await chromium.launch();
try {
  // --- shot exports at 3x DPR ---
  const ctx = await browser.newContext({
    viewport: { width: 1400, height: 2400 },
    deviceScaleFactor: 3,
    reducedMotion: 'reduce',
    colorScheme: 'dark',
  });
  const page = await ctx.newPage();
  await page.goto(`${base}/shots/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  for (const [sel, file] of shots) {
    await page.locator(sel).screenshot({ path: path.join(outDir, file) });
    console.log('wrote', file);
  }
  await ctx.close();

  // --- OG image, exact 1200x630 at 1x ---
  const ogCtx = await browser.newContext({
    viewport: { width: 1320, height: 760 },
    deviceScaleFactor: 1,
    colorScheme: 'dark',
  });
  const ogPage = await ogCtx.newPage();
  await ogPage.goto(`${base}/shots/`, { waitUntil: 'networkidle' });
  await ogPage.waitForTimeout(300);
  const box = await ogPage.locator('#og-canvas').boundingBox();
  const clip = { x: Math.round(box.x), y: Math.round(box.y), width: 1200, height: 630 };
  await ogPage.screenshot({
    path: path.join(root, 'public', 'assets', 'og.png'),
    clip,
    fullPage: true,
  });
  console.log('wrote public/assets/og.png');
  await ogPage.screenshot({ path: path.join(outDir, 'og.png'), clip, fullPage: true });
  await ogCtx.close();

  // --- whole-page render checks: 390px & 1280px, dark & light ---
  for (const scheme of ['dark', 'light']) {
    for (const width of [390, 1280]) {
      const c = await browser.newContext({
        viewport: { width, height: 900 },
        deviceScaleFactor: 2,
        reducedMotion: 'reduce',
        colorScheme: scheme,
      });
      const p = await c.newPage();
      await p.goto(`${base}/`, { waitUntil: 'networkidle' });
      await p.waitForTimeout(300);
      await p.screenshot({
        path: path.join(outDir, `page-${width}-${scheme}.png`),
        fullPage: true,
      });
      console.log(`wrote page-${width}-${scheme}.png`);
      await c.close();
    }
  }
} finally {
  await browser.close();
  server.kill();
}
console.log('done →', outDir);
