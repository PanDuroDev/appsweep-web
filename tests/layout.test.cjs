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
    assert.match(html, /tokens\.css\?v=20261029-layout2/);
    assert.match(html, /styles\.css\?v=20261029-mobile-nav3/);
    assert.match(html, /app\.js\?v=20261029-mobile-nav3/);
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
  assert.doesNotMatch(styles, /@media\s*\(max-width:\s*599px\)[\s\S]*?\.project-card__number\s*\{/);
});

test('release cards use a consistent vertical stack with actions aligned to the bottom', () => {
  assert.match(styles, /\.release-card\s*\{[^}]*display:\s*flex;[^}]*flex-direction:\s*column;[^}]*min-width:\s*0;/s);
  assert.match(styles, /\.release-card__actions\s*\{[^}]*margin-block-start:\s*auto;[^}]*padding-block-start:\s*var\(--app-spacing-2\)/s);
});


test('documentation has a complete section index and matching section targets', () => {
  const docs = read('docs.html');
  const links = [...docs.matchAll(/<a href="#([^"]+)">/g)].map(match => match[1]);
  const ids = new Set([...docs.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
  assert.deepEqual(links, ['overview', 'download', 'workflow', 'safety', 'build', 'troubleshooting', 'support']);
  for (const id of links) assert.ok(ids.has(id), `Missing documentation section target: #${id}`);
  assert.match(docs, /Pre-alpha software/);
  assert.match(docs, /A detected path is not proof that it is safe to delete/);
  assert.match(docs, /Remove usernames, personal file paths, tokens/);
});

test('documentation redesign includes responsive facts, reading blocks, and readable lists', () => {
  assert.match(styles, /\.docs-facts\s*\{[^}]*display:\s*grid/s);
  assert.match(styles, /\.docs-detail-list\s*\{[^}]*display:\s*grid/s);
  assert.match(styles, /\.docs-steps,\s*\.docs-checklist\s*\{[^}]*display:\s*grid/s);
  assert.match(styles, /@media\s*\(max-width:\s*839px\)[\s\S]*?\.docs-facts\s*\{\s*grid-template-columns:\s*1fr/);
});

/** Extracts one balanced CSS block so responsive assertions cannot match another breakpoint. */
function extractCssBlock(source, openingBraceIndex) {
  assert.equal(source[openingBraceIndex], '{', 'Expected a CSS opening brace');
  let depth = 0;
  for (let index = openingBraceIndex; index < source.length; index += 1) {
    if (source[index] === '{') depth += 1;
    if (source[index] === '}') {
      depth -= 1;
      if (depth === 0) return source.slice(openingBraceIndex + 1, index);
    }
  }
  assert.fail('Unclosed CSS block');
}

test('homepage balances the hero and release panel on compact desktop screens', () => {
  const mediaStart = styles.indexOf('@media (min-width: 1024px) and (max-width: 1199px)');
  assert.notEqual(mediaStart, -1, 'Missing compact desktop media query');
  const mediaOpen = styles.indexOf('{', mediaStart);
  const media = extractCssBlock(styles, mediaOpen);
  const homeStart = media.indexOf('.home-page');
  assert.notEqual(homeStart, -1, 'Missing compact desktop homepage rule');
  const homeOpen = media.indexOf('{', homeStart);
  const home = extractCssBlock(media, homeOpen);

  assert.match(home, /display:\s*grid/);
  assert.match(home, /grid-template-columns:\s*minmax\(0,\s*1\.15fr\)\s+minmax\(340px,\s*0\.85fr\)/);
  assert.match(home, /grid-template-areas:\s*"hero download"\s*"workflow workflow"\s*"footer footer"/);
  assert.match(media, /\.home-page > \.hero\s*\{[^}]*grid-area:\s*hero/s, 'Hero must occupy the hero grid area');
  assert.match(media, /\.home-page > \.hero\s*\{[^}]*min-width:\s*0/s);
  assert.match(media, /\.home-page > #download\s*\{[^}]*grid-area:\s*download/s);
  assert.match(media, /\.home-page > #workflow\s*\{[^}]*grid-area:\s*workflow/s);
  assert.match(media, /\.home-page > \.footer\s*\{[^}]*grid-area:\s*footer/s);
  assert.match(media, /\.home-page > #download \.section-heading\s*\{[^}]*max-width:\s*none/s);
});

test('homepage release title wraps long dynamic names without forcing horizontal overflow', () => {
  assert.match(styles, /\.release__title\s*\{[^}]*min-width:\s*0;[^}]*overflow-wrap:\s*anywhere/s);
  assert.match(read('index.html'), /id="release-title"/);
});



test('every page exposes an accessible collapsible mobile navigation', () => {
  for (const path of ['index.html', 'docs.html', 'releases.html', 'release.html']) {
    const html = read(path);
    assert.match(html, /<nav id="app-navigation" class="app-bar__nav" aria-label="Main navigation">/);
    assert.match(html, /id="menu-toggle" type="button" aria-controls="app-navigation" aria-expanded="false" aria-label="Open navigation"/);
    assert.match(html, /id="menu-icon" aria-hidden="true">menu/);
    assert.ok(html.indexOf('<div class="app-bar__actions">') < html.indexOf('<nav id="app-navigation"'), path + ' must put the menu controls before navigation in DOM order');
    assert.match(html, /href="releases.html"/);
  }

  assert.match(styles, /\.app-bar__menu-toggle\s*\{\s*display:\s*none;\s*\}/);
  const mobileQueryStart = styles.lastIndexOf('@media (max-width: 839px)');
  assert.notEqual(mobileQueryStart, -1, 'Missing compact navigation breakpoint');
  const mobileQuery = extractCssBlock(styles, styles.indexOf('{', mobileQueryStart));
  assert.match(mobileQuery, /grid-template-areas:\s*"brand actions"\s*"nav nav"/);
  assert.match(mobileQuery, /\.app-bar__inner\s*>\s*\.brand\s*\{\s*grid-area:\s*brand/);
  assert.match(mobileQuery, /\.app-bar__actions\s*\{\s*grid-area:\s*actions/);
  assert.match(mobileQuery, /\.app-bar__nav\s*\{\s*grid-area:\s*nav/);
  assert.match(mobileQuery, /\.app-bar__menu-toggle\s*\{\s*display:\s*inline-flex;\s*\}/);
  assert.match(mobileQuery, /\.app-bar\.has-mobile-menu:not\(\.is-menu-open\)\s+\.app-bar__nav\s*\{\s*display:\s*none;\s*\}/);
  assert.match(mobileQuery, /max-height:\s*calc\(100dvh\s*-\s*var\(--app-layout-app-bar-height\)\s*-\s*2rem\)/);
  assert.match(mobileQuery, /overflow-y:\s*auto/);
  assert.match(mobileQuery, /\.app-bar\.is-menu-open\s+\.app-bar__nav\s*\{\s*display:\s*flex;\s*\}/);
  const appJs = read('app.js');
  assert.match(appJs, /aria-expanded/);
  assert.match(appJs, /event\.key === 'Escape'/);
  assert.match(appJs, /document\.addEventListener\('click',[\s\S]*!bar\.contains\(event\.target\)/);
});
