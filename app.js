/* Shape silhouettes adapted from expressive-profile's render/kit.ts (MIT). */
(() => {
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let savedTheme;
  try { savedTheme = localStorage.getItem('theme'); } catch {}

  function setTheme(theme) {
    root.dataset.theme = theme;
    if (themeIcon) themeIcon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
    toggle?.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#111111' : '#f5f5f5');
  }
  setTheme(savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'dark');
  if (toggle) toggle.hidden = false;
  toggle?.addEventListener('click', () => {
    savedTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(savedTheme);
    try { localStorage.setItem('theme', savedTheme); } catch {}
  });

  const shapeParameters = {
    cookie: [9, .07, 1], clover: [4, .2, 1], sunny: [8, .1, 2.2],
    flower: [8, .16, 1], gem: [6, .07, 1.6], soft: [4, .05, .6], cookie12: [12, .05, 1],
  };
  const shapes = Object.fromEntries(Object.entries(shapeParameters).map(([name, [lobes, amplitude, sharpness]]) => [name,
    Array.from({ length: 180 }, (_, i) => {
      const cosine = Math.cos(lobes * i * Math.PI * 2 / 180);
      return 1 - amplitude + amplitude * Math.sign(cosine) * Math.abs(cosine) ** (1 / sharpness);
    }),
  ]));
  function points(radii, radius) {
    return radii.map((value, i) => {
      const angle = i * Math.PI * 2 / radii.length - Math.PI / 2;
      return [(50 + radius * value * Math.cos(angle)).toFixed(1), (50 + radius * value * Math.sin(angle)).toFixed(1)];
    });
  }
  document.querySelectorAll('[data-shape]').forEach(element => {
    const radii = shapes[element.dataset.shape];
    if (radii) element.style.clipPath = `polygon(${points(radii, 50).map(([x, y]) => `${x}% ${y}%`).join(',')})`;
  });

  const bar = document.getElementById('app-bar');
  const progressBars = [...document.querySelectorAll('svg.wavy')];
  const navLinks = [...document.querySelectorAll('.docs-nav a')];
  const sections = navLinks.map(link => document.getElementById(link.hash.slice(1)));
  let scrollFrame = 0;

  function wavePath(width, height) {
    const mid = height / 2;
    let path = `M0 ${mid}`;
    for (let x = 4; x < width; x += 4) path += ` L${x} ${(mid + 2 * Math.sin(x * Math.PI / 12)).toFixed(2)}`;
    return path + ` L${width.toFixed(2)} ${(mid + 2 * Math.sin(width * Math.PI / 12)).toFixed(2)}`;
  }
  function updateScroll() {
    scrollFrame = 0;
    const offset = (bar?.getBoundingClientRect().height || 72) + 20;
    root.style.setProperty('--app-header-offset', `${offset}px`);
    bar?.classList.toggle('is-stuck', scrollY > 4);
    const max = Math.max(0, root.scrollHeight - innerHeight);
    const progress = max ? Math.min(1, Math.max(0, scrollY / max)) : 0;
    progressBars.forEach(svg => {
      const { width, height } = svg.getBoundingClientRect();
      if (!width || !height) return;
      const reading = svg.classList.contains('wavy--bar');
      const end = (width - 4) * (reading ? progress : 1);
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
      const value = svg.querySelector('.wavy__value');
      value.setAttribute('d', wavePath(end, height));
      value.style.display = reading && progress === 0 ? 'none' : '';
      svg.querySelector('.wavy__track').setAttribute('d', reading
        ? `M${Math.min(width - 4, end + 8)} ${height / 2} H${width - 4}`
        : `M2 ${height / 2} H${width - 4}`);
      const stop = svg.querySelector('.wavy__stop');
      stop.setAttribute('cx', String(width - 3));
      stop.setAttribute('cy', String(height / 2));
    });
    if (navLinks.length) {
      let active = 0;
      sections.forEach((section, i) => { if (section && section.getBoundingClientRect().top <= offset + 30) active = i; });
      if (max > 0 && scrollY >= max - 2) active = navLinks.length - 1;
      navLinks.forEach((link, i) => i === active ? link.setAttribute('aria-current', 'location') : link.removeAttribute('aria-current'));
    }
  }
  function onScroll() { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll); }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll, { passive: true });
  addEventListener('load', onScroll);
  document.fonts?.ready.then(onScroll);
  updateScroll();

  const panel = document.getElementById('release-panel');
  if (!panel) return;
  const loading = panel.querySelector('.release__loading');
  const ready = panel.querySelector('.release__ready');
  const error = panel.querySelector('.release__error');
  const wave = panel.querySelector('.wavy--card');
  const title = document.getElementById('release-title');
  const meta = document.getElementById('release-meta');
  const download = document.getElementById('release-download');
  const latestDownload = document.getElementById('download-latest');
  const latestDownloadLabel = document.getElementById('download-latest-label');
  const releaseAssets = document.getElementById('release-assets');
  const releaseGithub = document.getElementById('release-github');
  const retry = document.getElementById('release-retry');
  const indicator = document.querySelector('#loading-indicator svg');
  const indicatorPath = indicator.querySelector('path');
  // shortcut: silhouettes match the reference, use AndroidX geometry if native platform parity becomes required.
  const sequence = Object.values(shapes);
  let loadingFrame = 0;

  function drawLoading(radii, rotation) {
    indicatorPath.setAttribute('d', 'M' + points(radii, 44).map(pair => pair.join(',')).join(' L') + ' Z');
    indicator.style.transform = `rotate(${rotation}deg)`;
  }
  function animateLoading() {
    cancelAnimationFrame(loadingFrame);
    loadingFrame = 0;
    drawLoading(sequence[0], 0);
    if (panel.dataset.state !== 'loading' || reducedMotion.matches || document.hidden) return;
    const start = performance.now();
    function frame(now) {
      const elapsed = Math.max(0, now - start);
      const index = Math.floor(elapsed / 520) % sequence.length;
      const t = (elapsed % 520) / 1000;
      // Reference's bouncy spring: stiffness 380, damping 18, mass 1.
      const blend = 1 - Math.exp(-9 * t) * (Math.cos(Math.sqrt(299) * t) + 9 / Math.sqrt(299) * Math.sin(Math.sqrt(299) * t));
      const radii = sequence[index].map((radius, i) => radius + (sequence[(index + 1) % sequence.length][i] - radius) * blend);
      drawLoading(radii, elapsed * 360 / 4000);
      loadingFrame = requestAnimationFrame(frame);
    }
    loadingFrame = requestAnimationFrame(frame);
  }
  document.addEventListener('visibilitychange', animateLoading);
  reducedMotion.addEventListener('change', animateLoading);

  function safeAsset(asset) {
    if (!asset || typeof asset.name !== 'string' || !/\.(exe|msi|msix|zip|7z|tar\.gz)$/i.test(asset.name) || typeof asset.browser_download_url !== 'string') return false;
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
      && /\.(zip|7z|tar\.gz)$/i.test(name);
  }
  function setLatestDownload(href, label) {
    if (latestDownload) latestDownload.href = href;
    if (latestDownloadLabel) latestDownloadLabel.textContent = label;
  }
  function safeReleasePage(urlValue) {
    if (typeof urlValue !== 'string') return false;
    try {
      const url = new URL(urlValue);
      return url.protocol === 'https:' && url.hostname === 'github.com' && !url.username && !url.password && !url.port
        && url.pathname.startsWith('/PanDuroDev/appsweep/releases/tag/');
    } catch { return false; }
  }
  function render(release) {
    download.hidden = true;
    download.removeAttribute('href');
    if (releaseAssets) releaseAssets.hidden = true;
    if (releaseGithub) releaseGithub.hidden = true;
    if (release === undefined) {
      title.textContent = 'No published release yet';
      meta.textContent = 'No AppSweep release has been published. The direct download will become available when a Windows build is attached to a release.';
      setLatestDownload('releases.html', 'No release available yet');
      return;
    }
    if (!release || typeof release !== 'object' || Array.isArray(release) || typeof release.tag_name !== 'string') throw new Error('Invalid release data');
    title.textContent = typeof release.name === 'string' && release.name ? release.name : release.tag_name;
    const date = new Date(release.published_at || NaN);
    const published = Number.isFinite(date.getTime()) ? `Published \${new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(date)}` : 'Published release';
    const asset = Array.isArray(release.assets) ? release.assets.find(isWindowsPackage) : null;
    const filesUrl = `release.html?tag=\${encodeURIComponent(release.tag_name)}`;
    if (releaseAssets) { releaseAssets.href = filesUrl; releaseAssets.hidden = false; }
    if (releaseGithub && safeReleasePage(release.html_url)) { releaseGithub.href = release.html_url; releaseGithub.hidden = false; }
    if (asset) {
      const size = Number.isFinite(asset.size) && asset.size > 0 ? ` · \${(asset.size / 1048576).toFixed(1)} MB` : '';
      meta.textContent = `\${published} · \${asset.name}\${size}\${release.prerelease ? ' · Prerelease' : ''}`;
      download.href = asset.browser_download_url;
      download.hidden = false;
      setLatestDownload(asset.browser_download_url, 'Download latest version');
    } else {
      meta.textContent = `\${published} · No Windows installer is attached. View the release files to see what is available.`;
      setLatestDownload(filesUrl, 'View latest available files');
    }
  }
  function setState(state) {
    panel.dataset.state = state;
    panel.setAttribute('aria-busy', String(state === 'loading'));
    loading.hidden = wave.hidden = state !== 'loading';
    ready.hidden = state === 'loading' || state === 'error';
    error.hidden = state !== 'error';
    retry.disabled = state === 'loading';
    if (state === 'error') setLatestDownload('releases.html', 'Could not check releases');
    animateLoading();
    onScroll();
  }
  async function load() {
    if (panel.dataset.state === 'loading') return;
    download.hidden = true;
    download.removeAttribute('href');
    setState('loading');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch('https://api.github.com/repos/PanDuroDev/appsweep/releases?per_page=1', {
        headers: { Accept: 'application/vnd.github+json' }, signal: controller.signal,
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const releases = await response.json();
      if (!Array.isArray(releases)) throw new Error('Invalid release list');
      render(releases[0]);
      setState(releases.length ? 'ready' : 'empty');
    } catch {
      setState('error');
    } finally {
      clearTimeout(timeout);
    }
  }
  retry.addEventListener('click', load);
  load();
})();
