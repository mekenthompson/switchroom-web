import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const read = (relativePath) => readFile(path.join(root, relativePath), 'utf8');
const exists = (relativePath) => access(path.join(root, relativePath)).then(() => true, () => false);

const nginx = await read('nginx.conf');
const homepage = await read('src/pages/index.astro');

// The Moondoog events page was removed from switchroom.ai (HF-711).
// No page, no redirect: /moondoog-events falls through to the normal 404.
assert.equal(await exists('public/moondoog-events'), false, 'page files must be removed');
assert.doesNotMatch(nginx, /moondoog/i, 'nginx must not route or redirect /moondoog-events');
assert.doesNotMatch(nginx, /return 30[12]/, 'no redirects are expected in nginx.conf');
assert.doesNotMatch(homepage, /moondoog/i);

// The catch-all must still 404 unknown paths instead of serving a fallback page.
const catchAll = nginx.match(/location \/ \{([^}]*)\}/);
assert.ok(catchAll, 'missing catch-all location');
assert.equal(catchAll[1].trim(), 'try_files $uri $uri/ =404;');

// If a build exists, it must not ship the page.
if (await exists('dist')) {
  assert.equal(await exists('dist/moondoog-events'), false, 'build output must not contain moondoog-events');
}

console.log('Moondoog events removal checks passed.');
