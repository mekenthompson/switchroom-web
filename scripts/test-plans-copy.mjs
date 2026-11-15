// HF-721: the Home page leads with Linear and presents Claude, ChatGPT and
// SuperGrok as peer plans. Claude is the current lead, not a permanent one,
// and Claude runs on subscription quota with no API-key fallback.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const read = (relativePath) => readFile(path.join(root, relativePath), 'utf8');

const home = await read('src/pages/index.astro');
const plans = await read('src/components/PlansCard.astro');
const base = await read('src/layouts/Base.astro');

assert.match(home, /Hermes agents that work your projects/);
assert.match(home, /Linear holds the thread\. Runs on the Claude, ChatGPT or SuperGrok plan you already pay for/);
assert.match(home, /Claude leads today, not forever/);
assert.match(home, /<h3>Runs on your plans<\/h3>/);
assert.match(home, /Claude means your subscription quota, not API billing\./);
assert.match(home, /no API key and no\s+pay-per-token fallback/);
assert.doesNotMatch(home, /Claude-first|Tuned for your Claude plan|Tuned for the Claude plan/);
assert.match(base, /Claude, ChatGPT or SuperGrok plan/);

// Plans card: three plans as peers, the lead marked as temporary.
for (const plan of ['Claude', 'ChatGPT', 'SuperGrok']) {
  assert.match(plans, new RegExp(`<b>${plan}</b>, plan login`), `${plan} missing from PlansCard`);
}
assert.match(plans, /leads this week/);
assert.match(plans, /API key fallback: <b>none set<\/b>/);
assert.doesNotMatch(plans, /Codex/);

console.log('Plans copy checks passed.');
