// Dynamic Expo config — extends static app.json with runtime values.
// Kept separate so app.json remains valid for Snack compatibility.
module.exports = ({ config }) => ({
  ...config,
  experiments: {
    ...config.experiments,
    // When deployed to GitHub Pages (project site), assets must be served
    // from /<repo>/ rather than /. EXPO_PUBLIC_BASE_PATH is set in CI to
    // the repo subpath (e.g. "/FinalProject2025"). Locally it is unset,
    // so baseUrl defaults to "" (root), which is correct for dev.
    baseUrl: process.env.EXPO_PUBLIC_BASE_PATH || '',
  },
});
