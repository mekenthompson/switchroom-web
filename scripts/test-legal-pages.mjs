import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const read = (relativePath) => readFile(path.join(root, relativePath), 'utf8');

const privacy = await read('src/pages/privacy.astro');
const terms = await read('src/pages/terms.astro');
const homepage = await read('src/pages/index.astro');

assert.match(privacy, /<h1[^>]*>Privacy Policy<\/h1>/);
assert.match(privacy, /Google API Services User Data Policy/);
assert.match(privacy, /including the Limited Use requirements/);
assert.match(privacy, /does not request Gmail access/);
assert.match(privacy, /do not use Google-derived data to train general-purpose AI models/);
assert.match(privacy, /myaccount\.google\.com\/connections/);
assert.match(privacy, /info@switchroom\.ai/);

assert.match(terms, /<h1[^>]*>Terms of Use<\/h1>/);
assert.match(terms, /Google connections are optional/);
assert.match(terms, /info@switchroom\.ai/);

assert.match(homepage, /<a href="\/privacy\/">Privacy Policy<\/a>/);
assert.match(homepage, /<a href="\/terms\/">Terms of Use<\/a>/);

const oauthLogo = path.join(root, 'public/assets/switchroom-oauth-120.png');
const logo = await readFile(oauthLogo);
assert.equal(logo.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
assert.equal(logo.readUInt32BE(16), 120);
assert.equal(logo.readUInt32BE(20), 120);
assert.ok((await stat(oauthLogo)).size < 1024 * 1024);

console.log('Legal page, footer navigation, and OAuth logo checks passed.');
