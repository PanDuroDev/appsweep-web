# AppSweep Web

A small, text-first website for [AppSweep](https://github.com/PanDuroDev/appsweep), an open-source Windows desktop application.

## Pages

- `index.html` — project overview, confirmed project purpose, download/release link, and source link.
- `docs.html` — basic download, build, safe-use, and support guidance.

## Stack

- Semantic HTML
- Responsive CSS with a dark Material Design 3-inspired color system
- No build step, package manager, external image assets, or API keys
- GitHub Pages deployed with GitHub Actions

## Local preview

Open `index.html` or `docs.html` in a browser, or serve this directory with any static HTTP server.

## Deployment

The workflow in `.github/workflows/pages.yml` deploys the repository root to GitHub Pages whenever a commit is pushed to `main`. Configure **Settings → Pages → Build and deployment → Source: GitHub Actions** if Pages is not enabled.

Intended site URL: https://pandurodev.github.io/appsweep-web/

The download button opens the project's GitHub Releases page. It does not imply that a downloadable release asset is currently available; check the releases page for the actual published files.
