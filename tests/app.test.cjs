const assert = require('node:assert/strict');
const { test } = require('node:test');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { runInNewContext } = require('node:vm');

const source = readFileSync(join(__dirname, '../app.js'), 'utf8');

function element() {
  const attributes = new Map();
  const listeners = {};
  return {
    dataset: {}, hidden: false, disabled: false, textContent: '', href: '', children: {},
    listeners, attributes, scrollHeight: 1800,
    style: { setProperty(name, value) { this[name] = value; } },
    classList: {
      values: new Set(),
      add(name) { this.values.add(name); },
      remove(name) { this.values.delete(name); },
      toggle(name, force) {
        if (force === undefined) force = !this.values.has(name);
        if (force) this.values.add(name); else this.values.delete(name);
        return force;
      },
      contains(name) { return this.values.has(name); },
    },
    setAttribute(name, value) { attributes.set(name, String(value)); },
    getAttribute(name) { return attributes.get(name); },
    removeAttribute(name) { attributes.delete(name); },
    addEventListener(name, fn) { listeners[name] = fn; },
    querySelector(name) { return this.children[name]; },
    getBoundingClientRect() { return { width: 240, height: 64, top: 100 }; },
  };
}

function boot({ releases = [], fetcher, stored, storageBlocked = false, withPanel = true, docs = false } = {}) {
  const ids = Object.fromEntries([
    'theme-toggle', 'theme-icon', 'app-bar', 'menu-toggle', 'menu-icon', 'download-latest', 'download-latest-label',
    'release-panel', 'release-title', 'release-meta', 'release-assets', 'release-github',
    'release-retry', 'workflow', 'download', 'build', 'safety', 'support',
  ].map(id => [id, element()]));
  const root = element();
  root.scrollHeight = 1800;
  ['download', 'build', 'safety', 'support'].forEach((id, index) => {
    ids[id].getBoundingClientRect = () => ({ top: 50 + index * 200, width: 0, height: 0 });
  });
  const panel = ids['release-panel'];
  panel.dataset.state = 'idle';
  for (const selector of ['.release__loading', '.release__ready', '.release__error']) {
    panel.children[selector] = element();
  }
  if (!withPanel) ids['release-panel'] = null;
  const docLinks = ['download', 'build', 'safety', 'support'].map(id => Object.assign(element(), { hash: '#' + id }));
  const metaTheme = element();
  const listeners = {};
  const navLinks = ['workflow', 'download', 'docs', 'source'].map(() => element());
  ids['app-bar'].querySelectorAll = selector => selector === '.app-bar__nav a' ? navLinks : [];
  const document = {
    documentElement: root,
    hidden: false,
    getElementById(id) { return ids[id] || null; },
    querySelector(selector) { return selector === 'meta[name="theme-color"]' ? metaTheme : null; },
    querySelectorAll(selector) {
      if (selector === '.docs-nav a' && docs) return docLinks;
      return [];
    },
    addEventListener(name, fn) { listeners['document:' + name] = fn; },
  };
  let saved = stored;
  const context = {
    document, URL, Intl, AbortController,
    scrollY: 0, innerHeight: 800,
    localStorage: {
      getItem() { if (storageBlocked) throw new Error('storage blocked'); return saved; },
      setItem(key, value) { if (storageBlocked) throw new Error('storage blocked'); saved = value; },
    },
    fetch: fetcher || (async () => ({ ok: true, json: async () => releases })),
    addEventListener(name, fn) { listeners[name] = fn; },
    requestAnimationFrame(fn) { return 1; },
    setTimeout, clearTimeout,
  };
  runInNewContext(source, context);
  return { ids, root, metaTheme, document, context, listeners, docLinks, navLinks, stored: () => saved };
}

async function flush() {
  for (let i = 0; i < 6; i++) await new Promise(resolve => setImmediate(resolve));
}

function release(tag = 'v1', assets = [], extra = {}) {
  return {
    tag_name: tag,
    name: 'AppSweep ' + tag,
    published_at: '2026-10-29T12:00:00Z',
    html_url: 'https://github.com/PanDuroDev/appsweep/releases/tag/' + tag,
    prerelease: false,
    assets,
    ...extra,
  };
}

function asset(name = 'AppSweep-Setup.exe', overrides = {}) {
  return {
    name,
    size: 1048576,
    browser_download_url: 'https://github.com/PanDuroDev/appsweep/releases/download/v1/' + encodeURIComponent(name),
    ...overrides,
  };
}

test('dark monochrome is the default and a selected theme persists', () => {
  const app = boot({ withPanel: false });
  assert.equal(app.root.dataset.theme, 'dark');
  assert.equal(app.metaTheme.getAttribute('content'), '#111111');
  app.ids['theme-toggle'].listeners.click();
  assert.equal(app.root.dataset.theme, 'light');
  assert.equal(app.metaTheme.getAttribute('content'), '#f5f5f5');
  assert.equal(app.stored(), 'light');
  assert.equal(boot({ withPanel: false, stored: 'light' }).root.dataset.theme, 'light');
});

test('dark theme remains available when local storage is blocked', () => {
  const app = boot({ withPanel: false, storageBlocked: true });
  assert.equal(app.root.dataset.theme, 'dark');
  app.ids['theme-toggle'].listeners.click();
  assert.equal(app.root.dataset.theme, 'light');
});

test('latest Windows package creates a direct download link', async () => {
  const file = asset();
  const app = boot({ releases: [release('v1', [file])] });
  await flush();
  assert.equal(app.ids['release-panel'].dataset.state, 'ready');
  assert.equal(app.ids['download-latest'].href, file.browser_download_url);
  assert.equal(app.ids['download-latest-label'].textContent, 'Download latest version');
  assert.equal(app.ids['release-title'].textContent, 'AppSweep v1');
  assert.equal(app.ids['release-assets'].href, 'release.html?tag=v1');
  assert.equal(app.ids['release-assets'].hidden, false);
  assert.equal(app.ids['release-github'].href, release('v1').html_url);
  assert.equal(app.ids['release-github'].hidden, false);
});

test('no release shows an empty state without inventing a download', async () => {
  const app = boot();
  await flush();
  assert.equal(app.ids['release-panel'].dataset.state, 'empty');
  assert.equal(app.ids['release-title'].textContent, 'No published release yet');
  assert.equal(app.ids['download-latest'].href, 'releases.html');
  assert.equal(app.ids['download-latest-label'].textContent, 'No release available yet');
  assert.equal(app.ids['release-github'].hidden, true);
});

test('release without a Windows package links to internal file details', async () => {
  const app = boot({ releases: [release('v1', [asset('AppSweep-source.zip')])] });
  await flush();
  assert.equal(app.ids['release-panel'].dataset.state, 'ready');
  assert.equal(app.ids['download-latest'].href, 'release.html?tag=v1');
  assert.equal(app.ids['download-latest-label'].textContent, 'View latest release files');
  assert.match(app.ids['release-meta'].textContent, /No Windows download is available/);
});

test('untrusted asset and release URLs are not used as destinations', async () => {
  const app = boot({
    releases: [release('v1', [
      asset('setup.exe', { browser_download_url: 'https://github.com.evil.test/PanDuroDev/appsweep/releases/download/v1/setup.exe' }),
    ], { html_url: 'https://github.com.evil.test/PanDuroDev/appsweep/releases/tag/v1' })],
  });
  await flush();
  assert.equal(app.ids['download-latest'].href, 'release.html?tag=v1');
  assert.equal(app.ids['release-github'].hidden, true);
});

test('GitHub errors are different from an empty list and retry can recover', async () => {
  let fail = true;
  const app = boot({ fetcher: async () => {
    if (fail) throw new Error('offline');
    return { ok: true, json: async () => [release('v1', [asset()])] };
  } });
  await flush();
  assert.equal(app.ids['release-panel'].dataset.state, 'error');
  assert.equal(app.ids['download-latest-label'].textContent, 'Could not check releases');
  fail = false;
  app.ids['release-retry'].listeners.click();
  await flush();
  assert.equal(app.ids['release-panel'].dataset.state, 'ready');
  assert.equal(app.ids['download-latest-label'].textContent, 'Download latest version');
});

test('malformed API payload is handled as an error', async () => {
  const app = boot({ fetcher: async () => ({ ok: true, json: async () => ({ error: 'invalid' }) }) });
  await flush();
  assert.equal(app.ids['release-panel'].dataset.state, 'error');
  assert.equal(app.ids['download-latest-label'].textContent, 'Could not check releases');
});

test('documentation navigation keeps a current-location state and the measured header offset', () => {
  const app = boot({ withPanel: false, docs: true });
  assert.equal(app.root.style['--app-layout-header-offset'], '72px');
  assert.equal(app.docLinks[0].getAttribute('aria-current'), 'location');
});
