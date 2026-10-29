const assert = require('node:assert/strict');
const { test } = require('node:test');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');

const tokens = readFileSync(join(__dirname, '../tokens.css'), 'utf8');
const styles = readFileSync(join(__dirname, '../styles.css'), 'utf8');

test('motion tokens use Material 3 web timing and state-layer values', () => {
  assert.match(tokens, /--app-motion-easing-standard:\s*cubic-bezier\(0\.2,\s*0,\s*0,\s*1\)/);
  assert.match(tokens, /--app-motion-easing-emphasized-decelerate:\s*cubic-bezier\(0\.05,\s*0\.7,\s*0\.1,\s*1\)/);
  assert.match(tokens, /--app-motion-duration-short2:\s*100ms/);
  assert.match(tokens, /--app-motion-duration-short3:\s*150ms/);
  assert.match(tokens, /--app-state-hover-opacity:\s*8%/);
  assert.match(tokens, /--app-state-focus-opacity:\s*10%/);
  assert.match(tokens, /--app-state-pressed-opacity:\s*10%/);
});

test('buttons expose hover, keyboard focus, pressed, and disabled feedback', () => {
  assert.match(styles, /\.btn:hover\s*\{[^}]*--app-state-hover-opacity/s);
  assert.match(styles, /\.btn:focus-visible\s*\{[^}]*--app-state-focus-opacity/s);
  assert.match(styles, /\.btn:active\s*\{[^}]*--app-state-pressed-opacity/s);
  assert.match(styles, /\.btn:disabled\s*\{/);
  assert.match(styles, /\.btn--outlined:disabled/);
  assert.match(styles, /:where\(a, button\):focus-visible\s*\{[^}]*outline:\s*2px solid/s);
});

test('navigation controls use non-moving state layers for hover, focus, and press', () => {
  for (const selector of [
    '.app-bar__nav a:hover',
    '.app-bar__nav a:focus-visible',
    '.app-bar__nav a:active',
    '.docs-nav a:hover',
    '.docs-nav a:focus-visible',
    '.docs-nav a:active',
  ]) {
    assert.ok(styles.includes(selector), 'missing ' + selector);
  }
  assert.match(styles, /\.app-bar__nav a\s*\{[^}]*transition:[^;]*background-color/s);
  assert.match(styles, /\.docs-nav a\s*\{[^}]*transition:[^;]*background-color/s);
  assert.doesNotMatch(styles, /(?:\.app-bar__nav a|\.docs-nav a|\.btn)(?::hover|:active|:focus-visible)[^{]*\{[^}]*transform\s*:/s);
});

test('decorative shadows, glows, gradients, and hover movement are absent', () => {
  assert.doesNotMatch(styles, /\bbox-shadow\s*:|\btext-shadow\s*:|\bfilter\s*:|\bbackdrop-filter\s*:|(?:linear|radial|conic)-gradient\s*\(/i);
  assert.doesNotMatch(styles, /(?:\.project-card|\.release-card|\.asset-group|img)(?::hover|:active)[^{]*\{[^}]*transform\s*:/s);
});

test('reduced-motion preference disables nonessential movement and transitions', () => {
  assert.match(styles, /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{[\s\S]*?scroll-behavior:\s*auto;[\s\S]*?\.loading-indicator\s*\{\s*animation:\s*none;[\s\S]*?transition:\s*none;/);
});
