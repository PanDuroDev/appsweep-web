(() => {
  const API = 'https://api.github.com/repos/PanDuroDev/appsweep/releases';
  const OWNED_RELEASE_PREFIX = '/PanDuroDev/appsweep/releases/download/';
  const listView = document.getElementById('releases-view');
  const detailView = document.getElementById('release-detail');
  if (!listView && !detailView) return;
  const get = id => document.getElementById(id);
  const setState = (view, state) => { if (view) { view.dataset.state = state; view.setAttribute('aria-busy', String(state === 'loading')); } };
  const el = (tag, className, text) => { const node = document.createElement(tag); if (className) node.className = className; if (text !== undefined && text !== null) node.textContent = String(text); return node; };
  const appendLink = (parent, href, label, className = 'btn btn--outlined btn--small') => { const link = el('a', className, label); link.href = href; parent.appendChild(link); return link; };
  const safeAsset = asset => {
    if (!asset || typeof asset.name !== 'string' || !asset.name.trim() || typeof asset.browser_download_url !== 'string') return false;
    try { const url = new URL(asset.browser_download_url); return url.protocol === 'https:' && url.hostname === 'github.com' && !url.username && !url.password && !url.port && url.pathname.startsWith(OWNED_RELEASE_PREFIX); } catch { return false; }
  };
  const classifyAsset = asset => {
    const name = asset.name.toLowerCase();
    if (/(^|[._ -])(source|sources|source-code|src)([._ -]|$)/i.test(name)) return 'source';
    if (/\.(dmg|pkg)$/i.test(name) || /(macos|mac-os|mac_os|darwin|osx|apple-silicon|aarch64-apple)/i.test(name)) return 'macos';
    if (/\.(appimage|deb|rpm|flatpak|snap)$/i.test(name) || /(linux|ubuntu|debian|fedora|appimage|unknown-linux|linux-gnu)/i.test(name)) return 'linux';
    if (/\.(exe|msi|msix)$/i.test(name) || /(^|[._ -])(windows|win64|win32|win-x64|win-x86)([._ -]|$)/i.test(name)) return 'windows';
    return 'other';
  };
  const safeReleasePage = value => {
    if (typeof value !== 'string') return false;
    try { const url = new URL(value); return url.protocol === 'https:' && url.hostname === 'github.com' && !url.username && !url.password && !url.port && url.pathname.startsWith('/PanDuroDev/appsweep/releases/tag/'); } catch { return false; }
  };
  const safeSourceUrl = (value, kind) => {
    if (typeof value !== 'string') return false;
    try { const url = new URL(value); return url.protocol === 'https:' && url.hostname === 'api.github.com' && !url.username && !url.password && !url.port && url.pathname.startsWith('/repos/PanDuroDev/appsweep/' + kind + '/'); } catch { return false; }
  };
  const formatDate = value => { const date = new Date(value || NaN); return Number.isFinite(date.getTime()) ? new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(date) : 'Publication date unavailable'; };
  const formatSize = value => Number.isFinite(value) && value > 0 ? (value / 1048576).toFixed(1) + ' MB' : '';
  const titleFor = release => typeof release.name === 'string' && release.name.trim() ? release.name : release.tag_name;
  async function fetchAllReleases() {
    const all = [];
    for (let page = 1; page <= 20; page++) {
      const response = await fetch(API + '?per_page=100&page=' + page, { headers: { Accept: 'application/vnd.github+json' } });
      if (!response.ok) throw new Error('GitHub returned HTTP ' + response.status);
      const batch = await response.json();
      if (!Array.isArray(batch)) throw new Error('GitHub returned an invalid release list');
      all.push(...batch.filter(release => release && typeof release.tag_name === 'string' && !release.draft));
      if (batch.length < 100) return all.sort((a, b) => new Date(b.published_at || 0).getTime() - new Date(a.published_at || 0).getTime());
    }
    throw new Error('Too many release pages to load safely');
  }
  function platformSummary(release) {
    const assets = Array.isArray(release.assets) ? release.assets.filter(safeAsset) : [];
    const platforms = [];
    for (const [key, label] of [['windows', 'Windows'], ['linux', 'Linux'], ['macos', 'macOS']]) if (assets.some(asset => classifyAsset(asset) === key)) platforms.push(label);
    if (safeSourceUrl(release.zipball_url, 'zipball') || safeSourceUrl(release.tarball_url, 'tarball') || assets.some(asset => classifyAsset(asset) === 'source')) platforms.push('Source code');
    return { assets, platforms };
  }
  function renderReleases(releases) {
    const target = get('releases-list-items'); target.replaceChildren();
    for (const release of releases) {
      const summary = platformSummary(release);
      const card = el('article', 'release-card'), header = el('div', 'release-card__head'), intro = el('div', 'release-card__intro');
      intro.appendChild(el('p', 'eyebrow', release.prerelease ? 'Prerelease' : 'Release'));
      intro.appendChild(el('h2', 'release-card__title', titleFor(release)));
      if (release.name && release.name !== release.tag_name) intro.appendChild(el('p', 'release-card__tag', release.tag_name));
      header.append(intro, el('span', 'release-version', release.tag_name)); card.appendChild(header);
      card.appendChild(el('p', 'release-card__meta', 'Published ' + formatDate(release.published_at)));
      const count = summary.assets.length + (summary.assets.length === 1 ? ' attached file' : ' attached files');
      card.appendChild(el('p', 'release-card__summary', count + ' · ' + (summary.platforms.length ? summary.platforms.join(' · ') : 'No platform-specific builds')));
      const actions = el('div', 'actions release-card__actions');
      appendLink(actions, 'release.html?tag=' + encodeURIComponent(release.tag_name), 'View available files', 'btn btn--tonal btn--small');
      if (safeReleasePage(release.html_url)) { const gh = appendLink(actions, release.html_url, 'GitHub release'); gh.target = '_blank'; gh.rel = 'noreferrer'; }
      card.appendChild(actions); target.appendChild(card);
    }
  }
  async function loadReleaseList() {
    if (!listView) return;
    setState(listView, 'loading'); get('releases-loading').hidden = false; get('releases-error').hidden = true; get('releases-empty').hidden = true; get('releases-list-items').hidden = true;
    try {
      const releases = await fetchAllReleases(); get('releases-loading').hidden = true;
      if (!releases.length) { get('releases-empty').hidden = false; setState(listView, 'empty'); return; }
      renderReleases(releases); get('releases-list-items').hidden = false; setState(listView, 'ready');
    } catch { get('releases-loading').hidden = true; get('releases-error').hidden = false; setState(listView, 'error'); }
  }
  function addAssetRow(parent, name, url, size) {
    const row = el('article', 'asset-row'), description = el('div', 'asset-row__description');
    description.appendChild(el('p', 'asset-row__name', name));
    if (size) description.appendChild(el('p', 'asset-row__size', size));
    row.appendChild(description);
    const download = appendLink(row, url, 'Download', 'btn btn--outlined btn--small asset-row__download');
    download.setAttribute('aria-label', 'Download ' + name); download.setAttribute('download', ''); parent.appendChild(row);
  }
  function fillGroup(key, files) {
    const status = get('availability-' + key), target = get('assets-' + key); target.replaceChildren();
    status.textContent = files.length ? 'Available · ' + files.length + (files.length === 1 ? ' file' : ' files') : 'Not available in this release';
    status.className = 'asset-status ' + (files.length ? 'asset-status--available' : 'asset-status--missing');
    for (const file of files) addAssetRow(target, file.name, file.url, file.size);
  }
  function renderDetail(release) {
    get('release-detail-title').textContent = titleFor(release);
    get('release-detail-tag').textContent = release.tag_name;
    get('release-detail-meta').textContent = 'Published ' + formatDate(release.published_at) + (release.prerelease ? ' · Prerelease' : '');
    const github = get('release-detail-github');
    if (safeReleasePage(release.html_url)) { github.href = release.html_url; github.hidden = false; } else { github.hidden = true; github.removeAttribute('href'); }
    const assets = Array.isArray(release.assets) ? release.assets.filter(safeAsset) : [];
    const groups = { windows: [], linux: [], macos: [], source: [], other: [] };
    for (const asset of assets) groups[classifyAsset(asset)].push({ name: asset.name, url: asset.browser_download_url, size: formatSize(asset.size) });
    if (safeSourceUrl(release.zipball_url, 'zipball')) groups.source.push({ name: 'Source code (ZIP)', url: release.zipball_url, size: '' });
    if (safeSourceUrl(release.tarball_url, 'tarball')) groups.source.push({ name: 'Source code (tar.gz)', url: release.tarball_url, size: '' });
    for (const key of Object.keys(groups)) fillGroup(key, groups[key]);
    const notes = get('release-detail-notes');
    notes.textContent = typeof release.body === 'string' && release.body.trim() ? release.body.trim() : 'No release notes were provided.';
    notes.hidden = false;
  }
  async function loadReleaseDetail() {
    if (!detailView) return;
    setState(detailView, 'loading'); get('release-detail-loading').hidden = false; get('release-detail-error').hidden = true; get('release-detail-empty').hidden = true; get('release-detail-content').hidden = true;
    let tag = ''; try { tag = new URLSearchParams(location.search).get('tag') || ''; } catch {}
    try {
      const releases = await fetchAllReleases(); get('release-detail-loading').hidden = true;
      if (!tag) { get('release-detail-empty-copy').textContent = 'Choose a version from the releases list to see its files.'; get('release-detail-empty').hidden = false; setState(detailView, 'empty'); return; }
      const release = releases.find(item => item.tag_name === tag);
      if (!release) {
        get('release-detail-empty-copy').textContent = releases.length ? 'This release could not be found. It may have been removed or the link may be outdated.' : 'No AppSweep releases have been published yet, so there are no release files to download.';
        get('release-detail-empty').hidden = false; setState(detailView, 'empty'); return;
      }
      renderDetail(release); get('release-detail-content').hidden = false; setState(detailView, 'ready');
    } catch { get('release-detail-loading').hidden = true; get('release-detail-error').hidden = false; setState(detailView, 'error'); }
  }
  get('releases-retry')?.addEventListener('click', loadReleaseList);
  get('release-detail-retry')?.addEventListener('click', loadReleaseDetail);
  loadReleaseList(); loadReleaseDetail();
})();