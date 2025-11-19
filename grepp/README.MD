# Grepp - Setup Summary

This document summarizes the initial technical setup completed for the Rally mobile app prototype.

## What was done
- Initialized a Snack-compatible Expo (React Native) managed project with Metro.
- Added core files: `package.json`, `app.json`, `babel.config.js`, `.gitignore`, `README.md`.
- Web support packages: `react-dom@18.3.1`, `react-native-web@~0.19.13`, `@expo/metro-runtime@~4.0.1`.
- Fonts: Acme via `@expo-google-fonts/acme` and `expo-font`; applied to logo/button.
- Project structure updates:
  - `assets/` (e.g., `assets/Splash.png`)
  - `UI/button-short.js` reusable primary CTA
  - `screens/WelcomeScreen.js` (first view)
- Welcome screen implemented with:
  - Mascot image from `assets/Splash.png` (bundled require)
  - Brand title, tagline
  - Reusable `ButtonShort`
  - Disclaimer modal (shows on load) with “Understood” to dismiss

## How to run locally
1. Install dependencies:
   - Clean install if prior failures: `rm -rf .npm-cache node_modules package-lock.json && mkdir -p .npm-cache`
   - `npm install`
2. Start Metro (Expo Dev Tools):
   - Mobile: `npx expo start --clear`
   - Web: `npx expo start --web --clear`
   - In Dev Tools press `i` (iOS), `a` (Android), or `w` (web)

## Snack compatibility
- Entry file is `App.js` (Snack-first).
- No custom native modules; works in Snack by pasting `App.js` into `https://snack.expo.dev`.

## Asset import notes
- Use bundled requires with correct casing:
  - `source={require('../assets/Splash.png')}`
- Avoid `uri: 'assets/...` for local files; that is for remote URLs only.

## Troubleshooting (macOS)
- If you see npm cache permission errors:
  - `sudo chown -R $(id -u):$(id -g) ~/.npm ~/.expo /Users/yanguangchen/Documents/GitHub/FinalProject2025/.npm-cache`
  - `rm -rf ~/.npm/_cacache`
  - Re-run install/start

## Next steps (optional)
- Add navigation and initial screens for Prepare, Alert, and Resource.
- Set up basic theming and accessibility controls (text scale, contrast).
- Introduce placeholder content for checklists, quiz, and resources.


