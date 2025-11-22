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

### Elevation map and Google Elevation API
- `screens/ElevationMapScreen.js` fetches elevation for a coordinate using the Google Elevation API and shows it in the bottom overlay.
- API key is read from `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` (or `GOOGLE_MAPS_API_KEY`). Ensure it is set in your env before running the app.
- On web, the screen attempts to geolocate the user (requires HTTPS) and then queries elevation; on native, geolocation uses `expo-location` (install it to enable).

#### Web map rendering (topographic)
- Uses a lightweight Leaflet embed with a terrain-focused basemap:
  - Default: OpenTopoMap (green terrain colors + sea/land outlines, no POIs/roads emphasis).
  - Optional: MapTiler Terrain + contours when `EXPO_PUBLIC_MAPTILER_KEY` is provided.
- Your location and the target (highest nearby) are marked, with a line between them.
- A stable zoom is used when targeting to avoid blank tiles from provider zoom gaps.

#### “Highest ground nearby” (2 km search)
- Clicking the button samples elevations in a circular area of ~2 km radius around the user.
- Grid resolution: 100 m (adaptive chunked requests to stay within API limits).
- Selection logic: highest elevation; ties broken by nearest distance to the user.
- UI: adds a marker for the result and draws a line from your location to the target. The overlay shows “Target: N m”.

#### Environment
- `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` (or `GOOGLE_MAPS_API_KEY`): required for elevation lookups. On web we use Maps JavaScript ElevationService (no CORS issues).
- `EXPO_PUBLIC_MAPTILER_KEY` (optional): enables MapTiler Terrain and contours on web.

#### Troubleshooting (web)
- If you see `ERR_BLOCKED_BY_CLIENT` or `gen_204` blocked, an extension (ad/tracker blocker) is interfering. Allow:
  - `maps.googleapis.com`, `maps.gstatic.com`, `www.google.com`, `gstatic.com`
  - Or test in an Incognito window with extensions disabled.
- Nav refresh resets to Welcome? We persist navigation state in sessionStorage on web so you can refresh without losing the current screen.

Sample request (Denver, CO):

```bash
https://maps.googleapis.com/maps/api/elevation/json?locations=39.7391536%2C-104.9847034&key=YOUR_API_KEY
```

Sample JSON response:

```json
{
  "results": [
    {
      "elevation": 1608.637939453125,
      "location": { "lat": 39.7391536, "lng": -104.9847034 },
      "resolution": 4.771975994110107
    }
  ],
  "status": "OK"
}
```

Notes:
- Web geolocation typically requires serving over HTTPS (or localhost).
- If permission is denied or geolocation is unavailable, the screen falls back to default Singapore coordinates and still fetches elevation.
- Native geolocation requires installing `expo-location`:
  - `npm install expo-location && npx expo install expo-location`

### Dashboard: SCDF updates and Weather widget (Web)
- SCDF updates on `HomeScreen` use an RSS feed and display the latest item:
  - Feed: [SCDF Updates RSS](https://rss.app/feeds/xBoCmprkh37V1t7g.xml)
  - Auto-refreshes every 5 minutes
  - Graceful fallback text shown while loading or on errors

### Shelter map (Google Places API, Web)
- `screens/ShelterMapScreen.js` renders a Google Map (via `srcDoc`) centered on the user and highlights nearby shelters.
- Query strategy (to maximize hits):
  - Nearby Search: keyword `shelter`, radius 10 km, type `point_of_interest`.
  - Text Search fallback: `SCDF shelter OR public shelter`, region `SG`.
  - Results are de-duplicated; markers include info windows and the map fits bounds to show them.
- Requires `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` (or `GOOGLE_MAPS_API_KEY`) with Places API enabled. On first load, the screen geolocates (browser permission needed).
- Native (iOS/Android): current view is a placeholder; can be upgraded with `expo-location` + a native map if needed.
- Troubleshooting: If markers don’t appear, ensure Places API is enabled for your key and allow Google scripts (ad/tracker blockers can interfere).

### Official Updates screen (RSS embeds, Web)
- Route: `OfficialUpdates` (tap “Government Alerts” on `HomeScreen`).
- Web-only embeds (native shows a placeholder message):
  - General feed widget: `rssapp-feed` id `X3DIbxijyrFdfjI1` via `https://widget.rss.app/v1/feed.js`.
  - SCDF feed widget: `rssapp-list` id `xBoCmprkh37V1t7g` via `https://widget.rss.app/v1/list.js`.
- The screen is scrollable (`ScrollView`) so multiple sections can be viewed.
- If feeds don’t load, allow third‑party scripts in the browser (extensions can block widget script loads).
- Weather widget (web-only) is embedded above the dashboard cards inside a `StatusCard`:
  - Container `nativeID`: `ww_c34773be0d417`
  - Script: `https://app3.weatherwidget.org/js/?id=ww_c34773be0d417`
  - Attributes applied to the container (transparent background, light text):
    - `v="1.3"`
    - `loc="id"`
    - `a='{"t":"horizontal","lang":"en","sl_lpl":1,"ids":["wl2912"],"font":"Arial","sl_ics":"one_a","sl_sot":"celsius","cl_bkg":"#FFFFFF00","cl_font":"#000000","cl_cloud":"#d4d4d4","cl_persp":"#2196F3","cl_sun":"#FFC107","cl_moon":"#FFC107","cl_thund":"#FF5722","el_whr":3}'`
- Native (iOS/Android) shows a `StatusCard` fallback since the widget is web-only.

### `StatusCard` now supports children
- Props: `title?: string`, `subtitle?: string`, `variant?: 'alert' | 'neutral'`, `compact?: boolean`, `children?: ReactNode`
- Example:
```jsx
<StatusCard title="Weather">
  <View nativeID="ww_c34773be0d417" style={{ width: '100%', minHeight: 120 }} />
</StatusCard>
```

### Preparation screen button sizing
- `PreparationScreen` uses `ButtonLong` for all list items.
- Screen-only text size override is applied via `textStyle` on `ButtonLong` to prevent truncation.
- Containers stretch to full width to ensure buttons occupy the full viewport width on web.

