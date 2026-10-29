(() => {
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const bar = document.getElementById('app-bar');
  const navLinks = [...document.querySelectorAll('.docs-nav a')];
  const sections = navLinks.map(link => document.getElementById(link.hash.slice(1)));
  let savedTheme;
  try { savedTheme = localStorage.getItem('theme'); } catch {}

  function setTheme(theme) {
    root.dataset.theme = theme;
    if (themeIcon) themeIcon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
    toggle?.setAttribute('aria-label', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' theme');
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#111111' : '#f5f5f5');
  }

  setTheme(savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'dark');
  if (toggle) toggle.hidden = false;
  toggle?.addEventListener('click', () => {
    savedTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(savedTheme);
    try { localStorage.setItem('theme', savedTheme); } catch {}
  });

  function updateNavigation() {
    const offset = (bar?.getBoundingClientRect().height || 64) + 8;
    root.style.setProperty('--app-layout-header-offset', offset + 'px');
    bar?.classList.toggle('is-stuck', scrollY > 0);
    if (!navLinks.length) return;

    let active = 0;
    sections.forEach((section, index) => {
      if (section && section.getBoundingClientRect().top <= offset + 16) active = index;
    });
    const maxScroll = Math.max(0, root.scrollHeight - innerHeight);
    if (maxScroll > 0 && scrollY >= maxScroll - 2) active = navLinks.length - 1;
    navLinks.forEach((link, index) => {
      if (index === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  const menuToggle = document.getElementById('menu-toggle');
  const menuIcon = document.getElementById('menu-icon');

  function setMenuOpen(open) {
    if (!bar || !menuToggle) return;
    bar.classList.toggle('is-menu-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    if (menuIcon) menuIcon.textContent = open ? 'close' : 'menu';
  }

  menuToggle?.addEventListener('click', () => {
    setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
  });

  bar?.querySelectorAll('.app-bar__nav a').forEach(link => {
    link.addEventListener('click', () => setMenuOpen(false));
  });

  document.addEventListener('click', event => {
    if (menuToggle?.getAttribute('aria-expanded') === 'true' && bar && !bar.contains(event.target)) {
      setMenuOpen(false);
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuToggle?.getAttribute('aria-expanded') === 'true') {
      setMenuOpen(false);
      menuToggle.focus();
    }
  });

  // Preserve navigation if JavaScript is disabled or setup fails.
  bar?.classList.add('has-mobile-menu');

  let scrollFrame = 0;
  function onScroll() {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = 0;
      updateNavigation();
    });
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', () => {
    if (innerWidth > 839) setMenuOpen(false);
    onScroll();
  }, { passive: true });
  updateNavigation();

  const panel = document.getElementById('release-panel');
  if (!panel) return;

  const loading = panel.querySelector('.release__loading');
  const ready = panel.querySelector('.release__ready');
  const error = panel.querySelector('.release__error');
  const title = document.getElementById('release-title');
  const meta = document.getElementById('release-meta');
  const latestDownload = document.getElementById('download-latest');
  const latestDownloadLabel = document.getElementById('download-latest-label');
  const releaseAssets = document.getElementById('release-assets');
  const releaseGithub = document.getElementById('release-github');
  const retry = document.getElementById('release-retry');

  function safeAsset(asset) {
    if (!asset || typeof asset.name !== 'string' || typeof asset.browser_download_url !== 'string') return false;
    if (!/\.(exe|msi|msix|zip|7z|tar\.gz)$/i.test(asset.name)) return false;
    try {
      const url = new URL(asset.browser_download_url);
      return url.protocol === 'https:' && url.hostname === 'github.com' && !url.username && !url.password && !url.port
        && url.pathname.startsWith('/PanDuroDev/appsweep/releases/download/');
    } catch { return false; }
  }

  function isWindowsPackage(asset) {
    if (!safeAsset(asset)) return false;
    const name = asset.name.toLowerCase();
    if (/\.(exe|msi|msix)$/i.test(name)) return true;
    return /(^|[._ -])(windows|win64|win32|win-x64|win-x86)([._ -]|$)/i.test(name)
      && !/(^|[._ -])(source|sources|src)([._ -]|$)/i.test(name)
      && /\.(zip|7z|tar\.gz)$/i.test(name);
  }

  function safeReleasePage(value) {
    if (typeof value !== 'string') return false;
    try {
      const url = new URL(value);
      return url.protocol === 'https:' && url.hostname === 'github.com' && !url.username && !url.password && !url.port
        && url.pathname.startsWith('/PanDuroDev/appsweep/releases/tag/');
    } catch { return false; }
  }

  function setLatestDownload(href, label) {
    latestDownload.href = href;
    latestDownloadLabel.textContent = label;
  }

  function render(release) {
    releaseAssets.hidden = true;
    releaseGithub.hidden = true;

    if (!release) {
      title.textContent = 'No stable release published yet';
      meta.textContent = 'No stable AppSweep release has been published. Prereleases are not offered as the latest stable download.';
      setLatestDownload('releases.html', 'No stable release available yet');
      return;
    }
    if (typeof release.tag_name !== 'string' || !Array.isArray(release.assets)) throw new Error('Invalid release data');

    title.textContent = typeof release.name === 'string' && release.name ? release.name : release.tag_name;
    const date = new Date(release.published_at || NaN);
    const published = Number.isFinite(date.getTime())
      ? 'Published ' + new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(date)
      : 'Published release';
    const windowsAsset = release.assets.find(isWindowsPackage);
    const filesUrl = 'release.html?tag=' + encodeURIComponent(release.tag_name);

    releaseAssets.href = filesUrl;
    releaseAssets.hidden = false;
    if (safeReleasePage(release.html_url)) {
      releaseGithub.href = release.html_url;
      releaseGithub.hidden = false;
    }

    if (windowsAsset) {
      const size = Number.isFinite(windowsAsset.size) && windowsAsset.size > 0
        ? ' · ' + (windowsAsset.size / 1048576).toFixed(1) + ' MB'
        : '';
      meta.textContent = published + ' · ' + windowsAsset.name + size + (release.prerelease ? ' · Prerelease' : '');
      setLatestDownload(windowsAsset.browser_download_url, 'Download latest version');
    } else {
      meta.textContent = published + ' · No Windows download is available for this release. View the release files to see what is available.';
      setLatestDownload(filesUrl, 'View latest release files');
    }
  }

  function setState(state) {
    panel.dataset.state = state;
    panel.setAttribute('aria-busy', String(state === 'loading'));
    loading.hidden = state !== 'loading';
    ready.hidden = state === 'loading' || state === 'error';
    error.hidden = state !== 'error';
    retry.disabled = state === 'loading';
  }

  async function load() {
    if (panel.dataset.state === 'loading') return;
    setLatestDownload('releases.html', 'Checking latest release…');
    setState('loading');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch('https://api.github.com/repos/PanDuroDev/appsweep/releases?per_page=100', {
        headers: { Accept: 'application/vnd.github+json' },
        signal: controller.signal,
      });
      if (!response.ok) throw new Error('GitHub returned HTTP ' + response.status);
      const releases = await response.json();
      if (!Array.isArray(releases) || releases.some(item => !item || typeof item !== 'object' || Array.isArray(item))) {
        throw new Error('Invalid release list');
      }
      // The API can return prereleases before the latest stable release.
      // Select the newest published stable release rather than blindly using item zero.
      const stableReleases = releases.filter(item => item.draft !== true && item.prerelease !== true
        && typeof item.tag_name === 'string');
      stableReleases.sort((a, b) => new Date(b.published_at || 0).getTime() - new Date(a.published_at || 0).getTime());
      render(stableReleases[0]);
      setState(stableReleases.length ? 'ready' : 'empty');
    } catch {
      setLatestDownload('releases.html', 'Could not check releases');
      setState('error');
    } finally {
      clearTimeout(timeout);
    }
  }

  retry.addEventListener('click', load);
  load();
})();
