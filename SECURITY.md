# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it responsibly.

**Do not open a public GitHub issue for security vulnerabilities.**

Instead, please email the maintainer directly:

- **Contact**: [Yanguangchen](https://github.com/Yanguangchen) (via GitHub profile)

Include the following in your report:

1. Description of the vulnerability
2. Steps to reproduce
3. Potential impact
4. Suggested fix (if any)

You can expect an initial acknowledgement within **72 hours**. We will work with you to understand the issue and coordinate a fix before any public disclosure.

## Scope

The following areas are in scope for security reports:

- **API key exposure** — Google Maps, MapTiler, or any other keys leaked in client bundles, logs, or source control
- **Dependency vulnerabilities** — known CVEs in npm packages used by the app
- **CI/CD pipeline** — workflow misconfigurations that could lead to secret exfiltration or supply-chain attacks
- **Docker image** — vulnerabilities in the published container image or its base layers
- **Client-side injection** — XSS or script injection via third-party widget embeds (RSS, weather)

The following are **out of scope**:

- Vulnerabilities in third-party services themselves (Google Maps API, GitHub Pages, rss.app)
- Denial-of-service attacks against the static hosting provider
- Issues that require physical access to a user's device

## Security Practices

This project follows these practices to reduce risk:

### Secrets management
- API keys are stored as GitHub Actions secrets and injected at build time via environment variables (`EXPO_PUBLIC_*`).
- No secrets are committed to source control.
- The Docker publish workflow authenticates to GHCR using the automatic `GITHUB_TOKEN` — no additional registry credentials are stored.

### Dependency management
- Dependencies are pinned in `package-lock.json` and installed with `npm ci` for reproducible builds.
- Run `npm audit` periodically to check for known vulnerabilities.

### Content Security Policy
- GitHub Pages deployments set `EXPO_PUBLIC_DISABLE_THIRD_PARTY_WIDGETS=1` to prevent third-party widget scripts that may use `eval` or `new Function` under strict CSP environments.

### Container security
- The production Docker image uses `nginx:1.27-alpine` (minimal attack surface).
- The multi-stage build ensures that source code and `node_modules` are not present in the final image — only the static `dist/` output is served.

## Disclosure Policy

- We follow a coordinated disclosure approach.
- Reporters will be credited in the fix commit or release notes (unless they prefer anonymity).
- We aim to release a fix within **14 days** of confirming a vulnerability.
