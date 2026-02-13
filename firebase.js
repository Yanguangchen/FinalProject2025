import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

const firebaseConfig = {
  apiKey: 'AIzaSyCSCQ4DNN3YQr9XR9u384JuA_lygoogL5c',
  authDomain: 'finalproject-2f896.firebaseapp.com',
  projectId: 'finalproject-2f896',
  storageBucket: 'finalproject-2f896.firebasestorage.app',
  messagingSenderId: '750359659584',
  appId: '1:750359659584:web:b5d3d2cdbc9a7b4106cba5',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export let appCheck = null;

// Web-only anti-abuse layer for Firebase services (optional but recommended).
// Set EXPO_PUBLIC_RECAPTCHA_V3_SITE_KEY to enable.
if (Platform.OS === 'web' && typeof window !== 'undefined') {
  const siteKey =
    (typeof process !== 'undefined' &&
      process.env &&
      process.env.EXPO_PUBLIC_RECAPTCHA_V3_SITE_KEY) ||
    '';
  if (siteKey) {
    try {
      appCheck = initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(siteKey),
        isTokenAutoRefreshEnabled: true,
      });
    } catch (_e) {
      // Fail open so auth still works if App Check is not yet configured.
    }
  }
}

export default app;
