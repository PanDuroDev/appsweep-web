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
    dataset: {}, hidden: false, textContent: '', children: {}, listeners,
    style: { setProperty(name, value) { this[name] = value; } },
    classList: { contains: () => false, toggle() {} },
    setAttribute: (name, value) => attributes.set(name, value),
    getAttribute: name => attributes.get(name),
    removeAttribute: name => attributes.delete(name),
    addEventListener: (name, fn) => { listeners[name] = fn; },
    querySelector(name) { return this.children[name]; },
    getBoundingClientRect: () => ({ width: 240, height: 14, top: 0 }),
  };
}

function boot({ releases = [], fetcher, stored, dark = false, reduced = false, storageBlocked = false, docs = false } = {}) {
  const ids = Object.fromEntries(['theme-toggle', 'theme-icon', 'app-bar', 'release-panel', 'release-title', 'release-meta', 'release-download', 'release-retry'].map(id => [id, element()]));
  const root = element();
  root.scrollHeight = 2000;
  const panel = ids['release-panel'];
  panel.dataset.state = 'idle';
  for (const selector of ['.release__loading', '.release__ready', '.release__error', '.wavy--card']) panel.children[selector] = element();
  const wave = panel.children['.wavy--card'];
  for (const selector of ['.wavy__track', '.wavy__value', '.wavy__stop']) wave.children[selector] = element();
  const indicator = element();
  indicator.children.path = element();
  const decoration = element();
  decoration.dataset.shape = 'flower';
  const media = { dark: { matches: dark, ...element() }, reduced: { matches: reduced, ...element() } };
  const links = ['download', 'build', 'safety', 'support'].map((id, i) => {
    ids[id] = element();
    ids[id].getBoundingClientRect = () => ({ top: 400 + 300 * i - context.scrollY });
    return Object.assign(element(), { hash: '#' + id });
  });
  const document = {
    documentElement: root, hidden: false, listeners: {},
    getElementById: id => docs && id === 'release-panel' ? null : ids[id],
    querySelector: selector => selector === '#loading-indicator svg' ? indicator : element(),
    querySelectorAll: selector => selector === '[data-shape]' ? [decoration] : selector === 'svg.wavy' ? docs ? [] : [wave] : selector === '.docs-nav a' && docs ? links : [],
    addEventListener(name, fn) { this.listeners[name] = fn; },
  };
  let saved = stored;
  let frameId = 0;
  let timerId = 0;
  const frames = new Map();
  const timers = new Map();
  const context = {
    document, URL, AbortController, Intl, performance: { now: () => 0 }, scrollY: 0, innerHeight: 800,
    matchMedia: query => query.includes('color-scheme') ? media.dark : media.reduced,
    localStorage: {
      getItem() { if (storageBlocked) throw new Error('blocked'); return saved; },
      setItem(key, value) { if (storageBlocked) throw new Error('blocked'); saved = value; },
    },
    addEventListener() {},
    requestAnimationFrame(fn) { frames.set(++frameId, fn); return frameId; },
    cancelAnimationFrame(id) { frames.delete(id); },
    setTimeout(fn) { timers.set(++timerId, fn); return timerId; },
    clearTimeout(id) { timers.delete(id); },
    fetch: fetcher || (async () => ({ ok: true, json: async () => releases })),
  };
  runInNewContext(source, context);
  function tick(now = 260) {
    for (const [id, fn] of [...frames]) { frames.delete(id); fn(now); }
  }
  return { ids, root, panel, indicator, document, media, frames, timers, tick, links, decoration, context, stored: () => saved };
}
const settle = () => new Promise(resolve => setImmediate(resolve));
const asset = (url = 'https://github.com/PanDuroDev/appsweep/releases/download/v1/AppSweep.exe') => ({ name: 'AppSweep.exe', size: 1048576, browser_download_url: url });
const release = assets => ({ tag_name: 'v1', name: '<b>Not HTML</b>', published_at: '2026-10-29T00:00:00Z', assets });

test('empty lookup hides loading, clears timeout, and stops animation', async () => {
  const app = boot();
  assert.equal(app.panel.dataset.state, 'loading');
  assert.match(app.indicator.children.path.getAttribute('d'), /^M.* Z$/);
  app.tick();
  assert.notEqual(app.indicator.style.transform, 'rotate(0deg)');
  await settle();
  app.tick();
  assert.equal(app.panel.dataset.state, 'empty');
  assert.equal(app.panel.getAttribute('aria-busy'), 'false');
  assert.equal(app.panel.children['.release__loading'].hidden, true);
  assert.equal(app.panel.children['.release__ready'].hidden, false);
  assert.equal(app.ids['release-download'].hidden, true);
  assert.equal(app.frames.size, 0);
  assert.equal(app.timers.size, 0);
});
test('a frame timestamp preceding setup cannot index before the first shape', () => {
  const app = boot({ fetcher: () => new Promise(() => {}) });
  app.tick(-1);
  assert.match(app.indicator.children.path.getAttribute('d'), /^M.* Z$/);
  for (let now = 0; now < 4500; now += 260) app.tick(now);
  assert.doesNotMatch(app.indicator.children.path.getAttribute('d'), /NaN|Infinity/);
});
test('safe assets render as text and skip malicious candidates', async () => {
  const app = boot({ releases: [release([asset('https://evil.test/file.exe'), asset()])] });
  await settle();
  assert.equal(app.panel.dataset.state, 'ready');
  assert.equal(app.ids['release-title'].textContent, '<b>Not HTML</b>');
  assert.match(app.ids['release-meta'].textContent, /1.0 MB/);
  assert.equal(app.ids['release-download'].href, asset().browser_download_url);
  assert.equal(app.ids['release-download'].hidden, false);
});
test('rejects downloads outside the official repository or with credentials', async () => {
  for (const url of ['http://github.com/PanDuroDev/appsweep/releases/download/v1/a.exe', 'https://github.com.evil.test/a.exe', 'https://github.com/other/repo/releases/download/v1/a.exe', 'https://user@github.com/PanDuroDev/appsweep/releases/download/v1/a.exe', 'javascript:alert(1)']) {
    const app = boot({ releases: [release([asset(url)])] });
    await settle();
    assert.equal(app.ids['release-download'].hidden, true, url);
  }
});
test('invalid dates and releases without Windows assets do not break rendering', async () => {
  const app = boot({ releases: [{ ...release([{ name: 'checksum.txt' }]), published_at: 'bad date' }] });
  await settle();
  assert.equal(app.panel.dataset.state, 'ready');
  assert.match(app.ids['release-meta'].textContent, /No Windows download/);
});
test('HTTP errors and malformed payloads produce an error, not an empty release', async () => {
  for (const response of [{ ok: false }, { ok: true, json: async () => ({ error: 'bad' }) }, { ok: true, json: async () => [{}] }, { ok: true, json: async () => [null] }]) {
    const app = boot({ fetcher: async () => response });
    await settle();
    app.tick();
    assert.equal(app.panel.dataset.state, 'error');
    assert.equal(app.panel.children['.release__error'].hidden, false);
    assert.equal(app.frames.size, 0);
  }
});
test('retry recovers and repeated clicks do not create concurrent lookups', async () => {
  let calls = 0;
  let resolve;
  const app = boot({ fetcher: async () => ++calls === 1 ? { ok: false } : new Promise(done => { resolve = done; }) });
  await settle();
  app.ids['release-retry'].listeners.click();
  app.ids['release-retry'].listeners.click();
  assert.equal(calls, 2);
  resolve({ ok: true, json: async () => [release([asset()])] });
  await settle();
  assert.equal(app.panel.dataset.state, 'ready');
});
test('timeout aborts the real request and clears the loader', async () => {
  const app = boot({ fetcher: (url, { signal }) => new Promise((resolve, reject) => signal.addEventListener('abort', () => reject(new Error('aborted')))) });
  [...app.timers.values()][0]();
  await settle();
  assert.equal(app.panel.dataset.state, 'error');
  assert.equal(app.timers.size, 0);
});
test('reduced motion and hidden documents stop loading frames', async () => {
  const app = boot({ reduced: true, fetcher: () => new Promise(() => {}) });
  app.tick();
  assert.equal(app.frames.size, 0);
  app.media.reduced.matches = false;
  app.media.reduced.listeners.change();
  assert.equal(app.frames.size, 1);
  app.document.hidden = true;
  app.document.listeners.visibilitychange();
  assert.equal(app.frames.size, 0);
});
test('dark monochrome is the default and explicit theme selections persist', () => {
  const app = boot({ docs: true });
  assert.equal(app.root.dataset.theme, 'dark');
  app.ids['theme-toggle'].listeners.click();
  assert.equal(app.stored(), 'light');
  assert.equal(app.root.dataset.theme, 'light');
  assert.equal(boot({ docs: true, stored: app.stored() }).root.dataset.theme, 'light');
  app.ids['theme-toggle'].listeners.click();
  assert.equal(app.stored(), 'dark');
  assert.equal(app.root.dataset.theme, 'dark');
  assert.equal(boot({ docs: true, stored: app.stored() }).root.dataset.theme, 'dark');
  const withoutStorage = boot({ docs: true, storageBlocked: true });
  assert.equal(withoutStorage.root.dataset.theme, 'dark');
  withoutStorage.ids['theme-toggle'].listeners.click();
  assert.equal(withoutStorage.root.dataset.theme, 'light');
});
test('reference silhouettes have 180 finite points and docs can select the final section', () => {
  const app = boot({ docs: true });
  assert.equal(app.decoration.style.clipPath.split(',').length, 180);
  assert.doesNotMatch(app.decoration.style.clipPath, /NaN|Infinity/);
  app.context.scrollY = 1200;
  app.ids['theme-toggle'].listeners.click();
  // Re-run the shared code at the bottom to check current-location selection.
  runInNewContext(source, app.context);
  assert.equal(app.links[3].getAttribute('aria-current'), 'location');
  assert.equal(app.links[0].getAttribute('aria-current'), undefined);
});
