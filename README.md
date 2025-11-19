## Rally — Expo (React Native) Starter

This repository contains a Snack-compatible Expo managed app scaffold with Metro bundler configured by default.

### Run locally
- Install Node 18+ and npm or yarn
- Install dependencies:
  - `npm install` or `yarn`
- Start Metro:
  - `npm run start` (uses npx expo; opens Expo Dev Tools)
  - Press `i` for iOS Simulator, `a` for Android, or `w` for web

### Snack compatibility
- Entry file: `App.js` (Snack-first)
- No native modules are required; only Expo managed runtime and core React Native APIs are used
- To try in Snack:
  - Copy the contents of `App.js` into `https://snack.expo.dev`
  - Or push this repo to GitHub and import it directly in Snack

### Scripts
- `npm run start`: Start Metro bundler (via `npx expo start`)
- `npm run ios`: Build and run iOS (managed)
- `npm run android`: Build and run Android (managed)
- `npm run web`: Start web preview

### Notes
- This scaffold pins Expo SDK in `package.json` and `app.json` for stability. You can update to a newer SDK with `npx expo install --fix`.
- Keep dependencies Snack-safe (avoid custom native modules) for maximum compatibility.

### If you see “expo: command not found” or npm cache errors
Run these once, then start again:
```bash
sudo chown -R $(id -u):$(id -g) ~/.npm ~/.expo
rm -rf ~/.npm/_cacache
cd /Users/yanguangchen/Documents/GitHub/FinalProject2025
mkdir -p .npm-cache
NPM_CONFIG_CACHE=$PWD/.npm-cache npm install
NPM_CONFIG_CACHE=$PWD/.npm-cache npx expo@latest start --clear
```

