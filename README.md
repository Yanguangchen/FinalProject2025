## Rally — Expo (React Native) Starter

This repository contains a Snack-compatible Expo managed app scaffold with Metro bundler configured by default.

### Run locally
- Install Node 18+ and npm or yarn
- Install dependencies:
  - `npm install` or `yarn`
- Install navigation + UI deps (if not already installed):
  - `npx expo install @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context`
  - `npx expo install @expo/vector-icons expo-linear-gradient`
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

### Project structure (key paths)
```
assets/                # images (e.g., Splash.png)
context/ProgressContext.js
screens/WelcomeScreen.js
screens/LanguageSelect.js
screens/HomeScreen.js
screens/PreparationScreen.js
screens/ShelterMapScreen.js
screens/ElevationMapScreen.js
UI/button-short.js     # primary CTA
UI/button-long.js      # full-width CTA (Preparation)
UI/progress-bar.js     # gradient progress (primary #0D00CA, accent #0022FF)
UI/select-long.js      # long list option with neumorphic shadow, outline #4B4B4B
UI/arrow-back.js       # back button icon
UI/status-card.js      # alert/neutral information tiles
UI/signal-indicator.js # signal/ping tile
```

### Progress state
- `ProgressContext` provides `progress`, `setProgress`, `advance(delta)`, `retreat(delta)`, `reset()`.
- `WelcomeScreen` sets initial progress to 0.1 and navigates to LanguageSelect.
- `LanguageSelect` shows the progress, back reduces progress by 0.1.

### Buttons sizing
- Long button width: `92%`.
- Short button width: `43%` (3% shorter than half of the long button).
- When two short buttons are shown in a row, the row container uses `width: '92%'` so the pair (button + gap + button) never exceeds the long button width.
- `PreparationScreen` renders multiple `button-long` items inside a centered parent container for consistent alignment.

### Button 3D interaction model
- Raised state: 4px offset shadow, elevation 4, no blur.
- Active state: remove shadow and translateY(4) to simulate depress.
- Shadow tinting:
  - Short/Long buttons: darker green tint `#228A00` (shadowOpacity 0.35).
  - Select-long: neutral `#7A7A7A` when unselected, darker blue `#0017B3` when selected (shadowOpacity 0.3).

### Maps placeholders
- `ShelterMapScreen` and `ElevationMapScreen` use a Google Maps `iframe` on web for quick preview.
- On mobile (Expo Go), a native placeholder view is rendered until the maps SDK/API is integrated.

### Connectivity and ping
- Network provider (`context/NetworkContext.js`) uses NetInfo and pings `https://www.gstatic.com/generate_204` every 15s.
- `UI/signal-indicator.js` consumes context and shows live strength and ping.
- `UI/connection-banner.js` displays a red banner when offline.
- Install (if missing): `npx expo install @react-native-community/netinfo expo-font @expo-google-fonts/acme`

