const assert = require('node:assert/strict');
const { test } = require('node:test');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { runInNewContext } = require('node:vm');
const source = readFileSync(join(__dirname, '../releases.js'), 'utf8');

function node(tag = 'div') {
  const attributes = new Map();
  const listeners = {};
  return {
    tagName: tag.toUpperCase(), className: '', textContent: '', hidden: false, dataset: {}, style: {},
    children: [], listeners, attributes,
    appendChild(child) { this.children.push(child); return child; },
    append(...children) { this.children.push(...children); },
    replaceChildren(...children) { this.children = [...children]; },
    setAttribute(name, value) { attributes.set(name, String(value)); },
    getAttribute(name) { return attributes.get(name); },
    removeAttribute(name) { attributes.delete(name); },
    addEventListener(name, handler) { listeners[name] = handler; },
  };
}
function walk(root) { return [root, ...(root.children || []).flatMap(walk)]; }
const listIds = ['releases-view','releases-status','releases-loading','releases-error','releases-empty','releases-list-items','releases-retry'];
const detailIds = ['release-detail','release-detail-status','release-detail-loading','release-detail-error','release-detail-empty','release-detail-empty-copy','release-detail-content','release-detail-retry','release-detail-title','release-detail-tag','release-detail-meta','release-detail-github','release-detail-notes',
  'availability-windows','assets-windows','availability-linux','assets-linux','availability-macos','assets-macos','availability-source','assets-source','availability-other','assets-other'];
function boot({ mode = 'list', search = '', fetcher, timers = {} } = {}) {
  const ids = {};
  for (const id of mode === 'list' ? listIds : detailIds) ids[id] = node();
  for (const id of ['releases-view','release-detail']) if (ids[id]) ids[id].dataset.state = 'idle';
  const document = { getElementById(id) { return ids[id]; }, createElement(tag) { return node(tag); } };
  runInNewContext(source, { document, URL, URLSearchParams, Intl, AbortController, location: { search },
    setTimeout: timers.setTimeout || setTimeout, clearTimeout: timers.clearTimeout || clearTimeout,
    fetch: fetcher || (async () => ({ ok: true, json: async () => [] })) });
  return { ids };
}
async function flush() { for (let i = 0; i < 5; i++) await new Promise(resolve => setImmediate(resolve)); }
const githubRelease = (tag, extra = {}) => ({
  tag_name: tag, name: 'AppSweep ' + tag, published_at: tag === 'v2' ? '2026-10-20T00:00:00Z' : '2026-09-20T00:00:00Z',
  html_url: 'https://github.com/PanDuroDev/appsweep/releases/tag/' + tag, prerelease: false, draft: false,
  assets: [], zipball_url: 'https://api.github.com/repos/PanDuroDev/appsweep/zipball/' + tag,
  tarball_url: 'https://api.github.com/repos/PanDuroDev/appsweep/tarball/' + tag, ...extra,
});
const asset = (name, tag = 'v2', overrides = {}) => ({
  name, size: 1024 * 1024, browser_download_url: 'https://github.com/PanDuroDev/appsweep/releases/download/' + tag + '/' + encodeURIComponent(name), ...overrides,
});

test('release index lists published versions and links to file details and GitHub', async () => {
  const releases = [githubRelease('v1'), githubRelease('v2', { assets: [asset('AppSweep.exe')] })];
  const app = boot({ fetcher: async () => ({ ok: true, json: async () => releases }) });
  await flush();
  assert.equal(app.ids['releases-view'].dataset.state, 'ready');
  assert.equal(app.ids['releases-list-items'].children.length, 2);
  assert.equal(app.ids['releases-status'].textContent, 'Loaded 2 releases.');
  const links = walk(app.ids['releases-list-items']).filter(n => n.tagName === 'A');
  assert.ok(links.some(n => n.href === 'release.html?tag=v2'), 'internal files link exists');
  assert.ok(links.some(n => n.href === 'https://github.com/PanDuroDev/appsweep/releases/tag/v2'), 'GitHub release link exists');
});

test('empty release index explicitly says no versions exist instead of fabricating a download', async () => {
  const app = boot();
  await flush();
  assert.equal(app.ids['releases-view'].dataset.state, 'empty');
  assert.equal(app.ids['releases-empty'].hidden, false);
  assert.equal(app.ids['releases-list-items'].children.length, 0);
  assert.equal(app.ids['releases-status'].textContent, 'No published releases are available.');
});

test('release index distinguishes API errors and retry can recover', async () => {
  let fail = true;
  const app = boot({ fetcher: async () => {
    if (fail) throw new Error('offline');
    return { ok: true, json: async () => [githubRelease('v1')] };
  }});
  await flush();
  assert.equal(app.ids['releases-view'].dataset.state, 'error');
  assert.equal(app.ids['releases-error'].hidden, false);
  assert.equal(app.ids['releases-status'].textContent, 'Could not load releases. Try again.');
  fail = false;
  app.ids['releases-retry'].listeners.click();
  await flush();
  assert.equal(app.ids['releases-view'].dataset.state, 'ready');
  assert.equal(app.ids['releases-list-items'].children.length, 1);
  assert.equal(app.ids['releases-status'].textContent, 'Loaded 1 release.');
});

test('release detail groups Windows, Linux, macOS, source archives, and extra files', async () => {
  const release = githubRelease('v2', { body: 'Security update', assets: [
    asset('AppSweep-Setup.exe'), asset('AppSweep-x86_64.AppImage'), asset('AppSweep-macos.dmg'),
    asset('AppSweep-source.zip'), asset('SHA256SUMS'),
  ]});
  const app = boot({ mode: 'detail', search: '?tag=v2', fetcher: async () => ({ ok: true, json: async () => [release] }) });
  await flush();
  assert.equal(app.ids['release-detail'].dataset.state, 'ready');
  assert.equal(app.ids['release-detail-title'].textContent, 'AppSweep v2');
  assert.match(app.ids['availability-windows'].textContent, /Available/);
  assert.match(app.ids['availability-linux'].textContent, /Available/);
  assert.match(app.ids['availability-macos'].textContent, /Available/);
  assert.match(app.ids['availability-source'].textContent, /Available/);
  assert.match(app.ids['availability-other'].textContent, /Available/);
  assert.equal(app.ids['assets-windows'].children.length, 1);
  assert.equal(app.ids['assets-linux'].children.length, 1);
  assert.equal(app.ids['assets-macos'].children.length, 1);
  assert.equal(app.ids['assets-source'].children.length, 3);
  assert.equal(app.ids['assets-other'].children.length, 1);
  assert.equal(app.ids['release-detail-status'].textContent, 'Release loaded. Windows, Linux, macOS, source code, other files are available.');
  const links = walk(app.ids['assets-windows']).filter(n => n.tagName === 'A');
  assert.ok(links.some(n => n.href === asset('AppSweep-Setup.exe').browser_download_url));
  assert.equal(app.ids['release-detail-notes'].textContent, 'Security update');
  assert.equal(app.ids['release-detail-github'].href, release.html_url);
});

test('detail page marks missing platforms and rejects non-official asset URLs', async () => {
  const release = githubRelease('v1', { assets: [
    asset('AppSweep.exe', 'v1'),
    asset('bad.msi', 'v1', { browser_download_url: 'https://github.com.evil.test/PanDuroDev/appsweep/releases/download/v1/bad.msi' }),
  ]});
  const app = boot({ mode: 'detail', search: '?tag=v1', fetcher: async () => ({ ok: true, json: async () => [release] }) });
  await flush();
  assert.equal(app.ids['release-detail'].dataset.state, 'ready');
  assert.match(app.ids['availability-linux'].textContent, /Not available/);
  assert.match(app.ids['availability-macos'].textContent, /Not available/);
  assert.match(app.ids['availability-other'].textContent, /Not available/);
  const links = walk(app.ids['release-detail-content']).filter(n => n.tagName === 'A');
  assert.ok(!links.some(n => String(n.href).includes('evil.test')));
});

test('unknown release tag displays a missing-release state', async () => {
  const app = boot({ mode: 'detail', search: '?tag=does-not-exist', fetcher: async () => ({ ok: true, json: async () => [githubRelease('v1')] }) });
  await flush();
  assert.equal(app.ids['release-detail'].dataset.state, 'empty');
  assert.equal(app.ids['release-detail-empty'].hidden, false);
  assert.equal(app.ids['release-detail-status'].textContent, 'This release could not be found.');
});

test('stalled release requests abort on timeout and retry uses a fresh signal', async () => {
  let timeoutCallback;
  let rejectFirst;
  const signals = [];
  const app = boot({
    fetcher: (url, options) => {
      signals.push(options.signal);
      if (signals.length === 1) return new Promise((resolve, reject) => { rejectFirst = reject; });
      return Promise.resolve({ ok: true, json: async () => [githubRelease('v1')] });
    },
    timers: { setTimeout(fn) { timeoutCallback = fn; return 1; }, clearTimeout() {} },
  });
  await flush();
  assert.equal(app.ids['releases-view'].dataset.state, 'loading');
  assert.equal(typeof timeoutCallback, 'function');
  timeoutCallback();
  assert.equal(signals[0].aborted, true);
  rejectFirst(Object.assign(new Error('Aborted'), { name: 'AbortError' }));
  await flush();
  assert.equal(app.ids['releases-view'].dataset.state, 'error');
  app.ids['releases-retry'].listeners.click();
  await flush();
  assert.equal(app.ids['releases-view'].dataset.state, 'ready');
  assert.equal(signals.length, 2);
  assert.notEqual(signals[0], signals[1]);
  assert.equal(signals[1].aborted, false);
});
