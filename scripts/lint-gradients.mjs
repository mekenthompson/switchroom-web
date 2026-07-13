#!/usr/bin/env node
/*
 * Gradient grey-box guard.
 *
 * WebKit interpolates the CSS keyword `transparent` as transparent *black*
 * (non-premultiplied), so a `colour -> transparent` gradient fades through
 * grey and paints a grey box / fringe (the hero grey-box bug, PR #31).
 *
 * This guard FAILS the build if the `transparent` keyword is used as a
 * colour stop inside any *-gradient(...) in src/**\/*.css or the inline
 * <style> of src/**\/*.astro.
 *
 * The fix is always: use a same-hue zero-alpha rgba(...,0) instead.
 *
 * A handful of legitimate uses (hard 1px/px stops that form a crisp edge,
 * and alpha masks where there is no visible colour band to interpolate)
 * are allow-listed by putting the marker comment
 *     GRADIENT-GUARD-ALLOW
 * on the SAME line as the `transparent` stop.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ALLOW = 'GRADIENT-GUARD-ALLOW';
const GRADIENT_RE = /(?:repeating-)?(?:linear|radial|conic)-gradient\s*\(/g;

function findGradientRanges(text) {
  // returns array of [start, end] index ranges covering each gradient(...) call
  const ranges = [];
  let m;
  GRADIENT_RE.lastIndex = 0;
  while ((m = GRADIENT_RE.exec(text)) !== null) {
    let i = m.index + m[0].length;
    let depth = 1;
    while (i < text.length && depth > 0) {
      const c = text[i];
      if (c === '(') depth++;
      else if (c === ')') depth--;
      i++;
    }
    ranges.push([m.index, i]);
  }
  return ranges;
}

function lineAt(text, idx) {
  return text.slice(0, idx).split('\n').length;
}

function scanFile(file) {
  const text = readFileSync(file, 'utf8');
  const ranges = findGradientRanges(text);
  const lines = text.split('\n');
  const violations = [];
  const tokRe = /\btransparent\b/g;
  let t;
  while ((t = tokRe.exec(text)) !== null) {
    // is this occurrence inside a gradient range?
    const inside = ranges.some(([s, e]) => t.index >= s && t.index < e);
    if (!inside) continue;
    const ln = lineAt(text, t.index);
    const lineText = lines[ln - 1] || '';
    if (lineText.includes(ALLOW)) continue; // allow-listed hard-stop / mask
    violations.push({ file, ln, lineText: lineText.trim() });
  }
  return violations;
}

function walk(dir) {
  const out = [];
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === 'node_modules' || ent.name.startsWith('.')) continue;
      out.push(...walk(full));
    } else if (/\.(css|astro)$/.test(ent.name)) {
      out.push(full);
    }
  }
  return out;
}

const files = walk(path.join(ROOT, 'src'));

let all = [];
for (const f of files) all = all.concat(scanFile(f));

if (all.length > 0) {
  console.error(
    `\n✗ gradient guard: found ${all.length} \`transparent\` colour stop(s) inside gradients.\n` +
      `  WebKit fades these through grey (the hero grey-box bug).\n` +
      `  Replace each with a same-hue zero-alpha rgba(...,0), or if it is a\n` +
      `  legitimate hard-stop / alpha-mask, append the comment ${ALLOW} on that line.\n`
  );
  for (const v of all) {
    console.error(`  ${path.relative(ROOT, v.file)}:${v.ln}: ${v.lineText}`);
  }
  console.error('');
  process.exit(1);
}

console.log('✓ gradient guard: no bare `transparent` gradient stops found.');
