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
  - `UI/progress-bar.js` gradient progress bar (primary `#0D00CA`, accent `#0022FF`, rail `#E7E4E7`, black outline)
  - `UI/select-long.js` option card with neumorphic shadow, outline `#4B4B4B`
  - `UI/arrow-back.js` back button (color `#4B4B4B`)
  - `UI/button-long.js` full-width CTA (used for Preparation)
  - `UI/status-card.js` alert/neutral cards
  - `UI/signal-indicator.js` network signal tile
  - `screens/WelcomeScreen.js` (first view with disclaimer modal)
  - `screens/LanguageSelect.js` (language list UI with progress/header)
  - `screens/HomeScreen.js` (dashboard with status, maps, preparation)
  - `context/ProgressContext.js` (global progress state via Context)
- Welcome screen implemented with:
  - Mascot image from `assets/Splash.png` (bundled require)
  - Brand title, tagline
  - Reusable `ButtonShort`
  - Disclaimer modal (shows on load) with “Understood” to dismiss
  - Navigates to `LanguageSelect`

## Navigation & state
- React Navigation stack added; `App.js` registers `Welcome` and `LanguageSelect`.
- `ProgressContext` provides `progress`, `setProgress`, `advance`, `retreat`, `reset`.
- `LanguageSelect` reads progress from context; back arrow calls `retreat(0.1)`; proceed calls `advance(0.1)` (placeholder for next route).
- Flow: Welcome → LanguageSelect → Home.

## Buttons sizing
- Long button (`button-long`) width is `92%`.
- Short button (`button-short`) width is `43%` (which is 3% less than half of the long button).
- Two short buttons are placed in a row container of `92%` width to ensure the pair never exceeds the long button width (leaves ~6% gap).

## How to run locally
1. Install dependencies:
   - Clean install if prior failures: `rm -rf .npm-cache node_modules package-lock.json && mkdir -p .npm-cache`
   - `npm install`
2. Start Metro (Expo Dev Tools):
   - Mobile: `npx expo start --clear`
   - Web: `npx expo start --web --clear`
   - In Dev Tools press `i` (iOS), `a` (Android), or `w` (web)

### Required packages (if missing)
```bash
npx expo install @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context
npx expo install @expo/vector-icons expo-linear-gradient
```

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


