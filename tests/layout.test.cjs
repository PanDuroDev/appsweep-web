const assert = require('node:assert/strict');
const { test } = require('node:test');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');

const root = join(__dirname, '..');
const read = path => readFileSync(join(root, path), 'utf8');
const styles = read('styles.css');
const tokens = read('tokens.css');

test('wide monitors use a broad app shell with intentional responsive margins', () => {
  assert.match(tokens, /--app-layout-content-max:\s*1920px/);
  assert.match(styles, /\.app-bar__inner\s*\{[^}]*width:\s*min\(var\(--app-layout-content-max\),\s*calc\(100%\s*-\s*var\(--app-spacing-6\)\)\)/s);
  assert.match(styles, /\.page\s*\{[^}]*width:\s*min\(var\(--app-layout-content-max\),\s*calc\(100%\s*-\s*var\(--app-spacing-6\)\)\)/s);
  assert.match(styles, /@media\s*\(max-width:\s*839px\)[\s\S]*?\.page\s*\{\s*width:\s*calc\(100%\s*-\s*var\(--app-spacing-5\)\)/);
  assert.match(styles, /@media\s*\(max-width:\s*599px\)[\s\S]*?\.page\s*\{\s*width:\s*calc\(100%\s*-\s*var\(--app-spacing-2\)\)/);
});

test('homepage uses available desktop width for a two-pane hero and release panel', () => {
  const home = read('index.html');
  assert.match(home, /<main class="page home-page"/);
  assert.match(styles, /@media\s*\(min-width:\s*1200px\)[\s\S]*?\.home-page\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0,\s*1\.3fr\)\s+minmax\(360px,\s*0\.9fr\)/);
  assert.match(styles, /grid-template-areas:\s*"hero download"\s*"workflow workflow"\s*"footer footer"/);
  assert.match(styles, /\.home-page > #download\s*\{[^}]*grid-area:\s*download/);
  assert.match(styles, /\.home-page > #workflow\s*\{\s*grid-area:\s*workflow/);
});

test('documentation gets an adaptive side index on large screens while keeping text readable', () => {
  const docs = read('docs.html');
  assert.match(docs, /<main class="page docs-page docs-page--with-nav"/);
  assert.match(styles, /\.docs-page--with-nav\s*\{\s*display:\s*grid;[\s\S]*?grid-template-columns:\s*minmax\(232px,\s*280px\)\s+minmax\(0,\s*1fr\)/);
  assert.match(styles, /\.docs-page--with-nav > \.docs-nav\s*\{[^}]*position:\s*sticky/s);
  assert.match(styles, /\.hero__lead\s*\{[^}]*max-width:\s*64ch/s);
  assert.match(styles, /\.section-copy\s*\{[^}]*max-width:\s*68ch/s);
});

test('releases and assets use adaptive grids rather than a single narrow column', () => {
  assert.match(styles, /\.release-list\s*\{[^}]*grid-template-columns:\s*repeat\(auto-fit,\s*minmax\(min\(100%,\s*440px\),\s*1fr\)\)/s);
  assert.match(styles, /\.asset-groups\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/s);
  assert.match(styles, /@media\s*\(min-width:\s*1200px\)[\s\S]*?\.asset-groups\s*\{\s*grid-template-columns:\s*repeat\(4,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(styles, /\.asset-group--wide\s*\{\s*grid-column:\s*1\s*\/\s*-1/);
});

test('all pages load the new layout styles and use matching cache keys', () => {
  for (const path of ['index.html', 'docs.html', 'releases.html', 'release.html']) {
    const html = read(path);
    assert.match(html, /tokens\.css\?v=20261029-md3-wide1/);
    assert.match(html, /styles\.css\?v=20261029-md3-tidy1/);
    assert.match(html, /app\.js\?v=20261029-md3-wide1/);
    assert.doesNotMatch(html, /styles\.css\?v=20261029-md3-wide1/);
    assert.doesNotMatch(html, /20261029-md3-(?:strict1|motion1|pressed1)/);
  }
});

test('design notes document the widened shell and adaptive classes', () => {
  const design = read('DESIGN_SYSTEM.md');
  assert.match(design, /1920px/);
  assert.match(design, /\.docs-page--with-nav/);
  assert.match(design, /four columns/i);
});


test('homepage step cards keep a compact and consistent label-to-title gap', () => {
  assert.match(styles, /\.project-card__number\s*\{[^}]*margin-block-end:\s*var\(--app-spacing-2\)/s);
  assert.doesNotMatch(styles, /@media\s*\(max-width:\s*599px\)[\s\\S]*?\.project-card__number\s*\{/);
});

test('release cards use a consistent vertical stack with actions aligned to the bottom', () => {
  assert.match(styles, /\.release-card\s*\{[^}]*display:\s*flex;[^}]*flex-direction:\s*column;[^}]*min-width:\s*0;/s);
  assert.match(styles, /\.release-card__actions\s*\{[^}]*margin-block-start:\s*auto;[^}]*padding-block-start:\s*var\(--app-spacing-2\)/s);
});
