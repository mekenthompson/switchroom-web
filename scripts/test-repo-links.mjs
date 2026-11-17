// HF-731: every outbound repo link and install command points at
// switchroom/switchroom, not the pre-move mekenthompson/hermes-fleet.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const fail = (msg) => {
  console.error(`test-repo-links: ${msg}`);
  process.exit(1);
};

const site = readFileSync('src/site.ts', 'utf8');
if (!/export const REPO = 'https:\/\/github\.com\/switchroom\/switchroom';/.test(site)) {
  fail('src/site.ts REPO must be https://github.com/switchroom/switchroom');
}

const OLD = [/mekenthompson\/hermes-fleet/, /hermes-fleet-public/, /ghcr\.io\/mekenthompson/];
const walk = (dir) =>
  readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
const files = [
  ...walk('src'),
  ...walk('public').filter((p) => /\.(html|txt|json|xml|webmanifest|md|js)$/.test(p)),
  'README.md',
];
// src/site.ts documents where the repo moved from; that comment is the only allowed mention.
const allowed = new Set([join('src', 'site.ts')]);
for (const f of files) {
  if (allowed.has(f)) continue;
  const text = readFileSync(f, 'utf8');
  for (const re of OLD) if (re.test(text)) fail(`${f} still references ${re}`);
}

const home = readFileSync('src/pages/index.astro', 'utf8');
if (!home.includes('cp -r switchroom/examples/overlay-repo')) {
  fail('install snippet must copy from the switchroom clone directory');
}
if (home.includes('cp -r hermes-fleet/')) fail('install snippet still uses the hermes-fleet clone directory');

console.log(`test-repo-links: ok (${files.length} files scanned)`);
