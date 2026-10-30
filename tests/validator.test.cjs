const assert = require('node:assert/strict');
const { test } = require('node:test');
const { spawnSync } = require('node:child_process');
const { mkdtempSync, rmSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');
const { tmpdir } = require('node:os');

const validator = join(__dirname, '..', 'validate_full.py');
const python = process.platform === 'win32' ? { command: 'py', args: ['-3'] } : { command: 'python3', args: [] };

function page(versions) {
  return `<!doctype html><html lang="en"><head><title>Fixture</title><link rel="stylesheet" href="tokens.css?v=${versions.tokens}"><link rel="stylesheet" href="styles.css?v=${versions.styles}"></head><body><main><h1>Fixture</h1></main></body></html>`;
}

function fixture(index, docs) {
  const root = mkdtempSync(join(tmpdir(), 'appsweep-validator-'));
  writeFileSync(join(root, 'index.html'), page(index));
  writeFileSync(join(root, 'docs.html'), page(docs));
  writeFileSync(join(root, 'tokens.css'), ':root { --md-sys-color-on-surface: #111111; }\n@media (forced-colors: active) { :root { color: CanvasText; } }\n');
  writeFileSync(join(root, 'styles.css'), 'body { color: var(--md-sys-color-on-surface); }\n');
  return root;
}

function validate(root) {
  return spawnSync(python.command, [...python.args, validator], { cwd: root, encoding: 'utf8' });
}

test('validator accepts independent stylesheet cache versions', (t) => {
  const root = fixture({ tokens: 'tokens-1', styles: 'styles-2' }, { tokens: 'tokens-1', styles: 'styles-2' });
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const result = validate(root);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /passed \(2 HTML pages, 2 CSS files\)/);
});

test('validator rejects a cross-page cache-version mismatch per asset', (t) => {
  const root = fixture({ tokens: 'tokens-1', styles: 'styles-2' }, { tokens: 'tokens-3', styles: 'styles-2' });
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const result = validate(root);
  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /tokens\.css cache versions differ between HTML pages/);
});
