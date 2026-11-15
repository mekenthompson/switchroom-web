import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const read = (relativePath) => readFile(path.join(root, relativePath), 'utf8');
const exists = (relativePath) => access(path.join(root, relativePath)).then(() => true, () => false);

const target = 'https://moondoog.kenthompson.com.au/';
const nginx = await read('nginx.conf');
const homepage = await read('src/pages/index.astro');

// The page moved off the product domain (HF-711); only permanent redirects remain.
assert.equal(await exists('public/moondoog-events'), false, 'page files must be removed');

const block = (pattern) => {
  const match = nginx.match(new RegExp(pattern + '\\s*\\{([^}]*)\\}'));
  assert.ok(match, `missing nginx block: ${pattern}`);
  return match[1].trim();
};
assert.equal(block('location = /moondoog-events'), `return 301 ${target};`);
assert.equal(block('location \\^~ /moondoog-events/'), `return 301 ${target};`);
assert.doesNotMatch(nginx, /try_files \/moondoog-events/);
assert.doesNotMatch(nginx, /location \/artifact\//);
assert.doesNotMatch(homepage, /moondoog-events/);

console.log('Moondoog events redirect checks passed.');
