import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const read = (relativePath) => readFile(path.join(root, relativePath), 'utf8');

const page = await read('public/moondoog-events/index.html');
const nginx = await read('nginx.conf');
const homepage = await read('src/pages/index.astro');

assert.match(page, /View events/);
assert.match(page, /Replay/);
assert.match(page, /Mute/);
assert.match(page, /dQw4w9WgXcQ/);
assert.match(page, /playsinline=1/);
assert.doesNotMatch(nginx, /location \/artifact\//);
assert.match(nginx, /location = \/moondoog-events \{/);
assert.doesNotMatch(homepage, /moondoog-events/);

console.log('Moondoog events route checks passed.');
