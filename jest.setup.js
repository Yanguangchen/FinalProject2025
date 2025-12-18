// Ensure fetch exists in tests
import 'whatwg-fetch';

// Force Platform to web by default for our web-focused tests
import { Platform } from 'react-native';
try {
  Platform.OS = 'web';
} catch (_) {}

// Filter noisy BackHandler errors from react-native-web when using navigation
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

const silentErrorMatchers = [
  /BackHandler is not supported on web/i,
  /Cross origin .* forbidden/i,
];
const silentWarnMatchers = [
  /"shadow\*".*deprecated/i,
  /"textShadow\*".*deprecated/i,
];

console.error = (...args) => {
  const msg = String(args?.[0] ?? '');
  if (silentErrorMatchers.some((r) => r.test(msg))) return;
  originalConsoleError(...args);
};
console.warn = (...args) => {
  const msg = String(args?.[0] ?? '');
  if (silentWarnMatchers.some((r) => r.test(msg))) return;
  originalConsoleWarn(...args);
};

// Provide a minimal geolocation mock; tests can override per-case
if (typeof navigator !== 'undefined') {
  if (!navigator.geolocation) {
    navigator.geolocation = {
      getCurrentPosition: (success, error) => {
        if (typeof success === 'function') {
          success({ coords: { latitude: 1.3521, longitude: 103.8198 } });
        }
      },
      watchPosition: () => 0,
      clearWatch: () => {},
    };
  }
}

// Provide a permissive default fetch for cross-origin in tests; individual tests can override
const realFetch = global.fetch;
global.fetch = async (...args) => {
  try {
    const url = String(args?.[0] ?? '');
    if (/googleapis|gstatic|maps\.google|weatherwidget|rss\.app/i.test(url)) {
      return new Response('', { status: 204, headers: { 'content-type': 'text/plain' } });
    }
  } catch (_) {}
  return realFetch(...args);
};


