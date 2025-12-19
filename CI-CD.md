# Containerization & CI/CD (Docker + GitHub Actions)

This project ships an **Expo (React Native) app exported as a static web build** and supports two deployment paths:

- **GitHub Pages** (static hosting) via `dist/`
- **Docker / Nginx** (containerized static hosting) via a multi-stage build

---

## Test parameters

- **Test runner**: Jest (`jest-expo` preset)
- **Test environment**: `jsdom` (web-like DOM)
- **Test match**: `**/__tests__/**/*.test.[jt]s?(x)`
- **Setup file**: `jest.setup.js`
  - forces `Platform.OS = 'web'` for web-focused tests
  - provides `fetch` via `whatwg-fetch`
  - mocks `navigator.geolocation` (default SG coords)
  - filters noisy React Native Web console warnings/errors
  - provides permissive `fetch` responses for known third-party URLs in tests (Google/Maps/RSS/WeatherWidget)
- **CI Node version**: Node `20` (via `actions/setup-node@v4`)
- **CI install**: `npm ci --no-audit --no-fund`
- **Coverage**: enabled in CI via `npm test -- --coverage`

---

## Unit Tests

Unit tests focus on individual UI components (rendering, props, basic interactions). Examples include:

- `ui-arrow-back.web.test.js`
- `ui-button-long.web.test.js`
- `ui-button-short.web.test.js`
- `ui-connection-banner.web.test.js`
- `ui-progress-bar.web.test.js`
- `ui-select-long.web.test.js`
- `ui-signal-indicator.web.test.js`
- `ui-status-card.web.test.js`

---

## Integration tests

Integration tests validate complete screens and navigation-level behavior in a web-like environment:

- `screens-welcome.web.test.js`
- `screens-language-select.web.test.js`
- `screens-home.web.test.js`
- `screens-preparation.web.test.js`
- `screens-map.web.test.js` (Map screen: renders level nodes and navigates to levels)
- `screens-shelter-map.web.test.js`
- `screens-elevation-map.web.test.js` (file: `ElevationMapScreen.web.test.js`)
- `screens-official-updates.web.test.js`

These tests use `jsdom` and mocks (fetch/geolocation) to avoid relying on real network calls.

---

## Test suites

Test suites are organized by folder naming and intent under `__tests__/`:

- **UI suite**: component-level tests (`ui-*.web.test.js`)
- **Screens suite**: screen-level / integration tests (`screens-*.web.test.js`, `ElevationMapScreen.web.test.js`)

---

## Docker containerization

### Multi-stage `Dockerfile`

The `Dockerfile` uses **three stages**:

- **`deps`**: installs Node dependencies with `npm ci`
- **`build`**: runs the Expo web export (`npm run export:web`) to generate a static build in `./dist`
- **`web`**: copies `dist/` into an **Nginx** image and serves it from `/usr/share/nginx/html`

Key behavior:

- The container serves static files through Nginx.
- The exported web build output directory is **`dist/`**.
- Public build-time env vars are passed in as Docker build args:
  - `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY`
  - `EXPO_PUBLIC_MAPTILER_KEY`

### Nginx config (`nginx.conf`)

`nginx.conf`:

- sets `index index.html`
- caches static assets (`.js`, `.css`, images, fonts) aggressively
- implements an SPA fallback:
  - `try_files $uri $uri/ /index.html;`

### Local Docker usage (`docker-compose.yml`)

`docker-compose.yml` defines two services:

- **`web`** (production-like):
  - builds the `web` target
  - serves via Nginx on `http://localhost:8080`
  - passes build args for public API keys
- **`dev`** (development):
  - builds the `dev` target
  - bind-mounts the repo into `/app`
  - runs `npm run web` (Expo web dev server) on `http://localhost:8081`

---

## CI/CD with GitHub Actions

Workflows live in `.github/workflows/`.

### 1) CI: tests + static web export (`ci.yml`)

Triggers:

- `push` to `main`
- `pull_request`
- manual `workflow_dispatch`

Steps:

- checkout
- install dependencies (`npm ci`)
- run tests (`npm test -- --coverage`)
- export static web build (`npm run export:web`)
- **verify build output exists** (fails the job if `dist/index.html` is missing)
- upload build artifact named `web-dist` (the `dist/` folder)

### 2) GitHub Pages deploy (`deploy-pages.yml`)

Triggers:

- `push` to `main`
- manual `workflow_dispatch`

Build job:

- checkout + `actions/configure-pages@v5`
- install dependencies (`npm ci`)
- export static web build (`npm run export:web`)
- **CSP-safe mode on Pages**:
  - sets `EXPO_PUBLIC_DISABLE_THIRD_PARTY_WIDGETS=1` to avoid third-party widgets that may use `eval/new Function` under strict CSP environments
- **GitHub Pages subpath fix**:
  - rewrites `dist/index.html` to prefix root-absolute asset URLs (`/…`) with `/<repo>/…`
- verify `dist/index.html` exists
- writes `dist/.nojekyll`
- writes `dist/404.html` (SPA fallback) by copying `dist/index.html`
- uploads the Pages artifact from `dist/`

Deploy job:

- uses `actions/deploy-pages@v4` to publish the artifact

> Important: GitHub repo **Settings → Pages → Source** should be set to **“GitHub Actions”** (not “Deploy from a branch”).

### 3) Docker publish to GHCR (`docker-publish.yml`)

Triggers:

- `push` to `main`
- manual `workflow_dispatch`

Steps:

- checkout
- setup buildx
- compute a **lowercase** GHCR image name (GHCR requires lowercase repository paths)
- login to GHCR using `${{ secrets.GITHUB_TOKEN }}`
- build and push the Docker image (target: `web`)

Published tags:

- `ghcr.io/<lowercase-owner>/finalproject2025:latest`
- `ghcr.io/<lowercase-owner>/finalproject2025:<git-sha>`

---

## Required secrets / environment variables

These are used as **public build-time** values (Expo “public” env vars):

- **`EXPO_PUBLIC_GOOGLE_MAPS_API_KEY`**: Google Maps key (used by map/elevation features on web)
- **`EXPO_PUBLIC_MAPTILER_KEY`**: optional MapTiler key for terrain/contours on web

For GitHub Pages, the build also sets:

- **`EXPO_PUBLIC_BASE_PATH=/<repo>`**: the repo subpath (e.g. `/FinalProject2025`)
- **`EXPO_PUBLIC_DISABLE_THIRD_PARTY_WIDGETS=1`**: disables third-party widgets to reduce CSP issues

---

## How to trigger the pipelines

### Trigger via GitHub UI

Repo → **Actions**:

- **CI** → **Run workflow**
- **Deploy Pages** → **Run workflow**
- **Publish Docker** → **Run workflow**

### Trigger via git push to `main`

Push any commit to `main`. If you just want to force a run, use an empty commit:

```bash
git checkout main
git pull
git commit --allow-empty -m "Trigger CI/CD"
git push origin main
```

---

## Troubleshooting quick notes

- **Blank GitHub Pages site / missing JS bundles (404)**:
  - usually caused by wrong base path on project pages (`/<repo>/`)
  - this repo’s Pages workflow rewrites `dist/index.html` to fix `src="/…" / href="/…"` to `/<repo>/…`
- **CSP “blocked eval”**:
  - commonly triggered by third-party widget scripts under strict CSP environments
  - Pages builds set `EXPO_PUBLIC_DISABLE_THIRD_PARTY_WIDGETS=1` to avoid those scripts