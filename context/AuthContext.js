import React from 'react';
import { auth } from '../firebase';
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
} from 'firebase/auth';

const AuthContext = React.createContext({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

const googleProvider = new GoogleAuthProvider();
const RECAPTCHA_SITE_KEY =
  (typeof process !== 'undefined' &&
    process.env &&
    process.env.EXPO_PUBLIC_RECAPTCHA_SITE_KEY) ||
  '';

async function loadRecaptchaEnterpriseScript() {
  if (typeof window === 'undefined') return;
  if (window.grecaptcha && window.grecaptcha.enterprise) return;
  if (!RECAPTCHA_SITE_KEY) return;

  await new Promise((resolve, reject) => {
    const existing = document.getElementById('recaptcha-enterprise-js');
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('Failed to load reCAPTCHA script')), {
        once: true,
      });
      return;
    }
    const script = document.createElement('script');
    script.id = 'recaptcha-enterprise-js';
    script.src = `https://www.google.com/recaptcha/enterprise.js?render=${encodeURIComponent(RECAPTCHA_SITE_KEY)}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load reCAPTCHA script'));
    document.head.appendChild(script);
  });
}

async function getRecaptchaToken(action) {
  if (typeof window === 'undefined') return null;
  if (!RECAPTCHA_SITE_KEY) return null;
  await loadRecaptchaEnterpriseScript();
  if (!(window.grecaptcha && window.grecaptcha.enterprise)) return null;

  return new Promise((resolve) => {
    window.grecaptcha.enterprise.ready(async () => {
      try {
        const token = await window.grecaptcha.enterprise.execute(RECAPTCHA_SITE_KEY, { action });
        resolve(token || null);
      } catch (_e) {
        resolve(null);
      }
    });
  });
}

async function verifyRecaptchaToken(token, action) {
  const verifyUrl =
    (typeof process !== 'undefined' &&
      process.env &&
      process.env.EXPO_PUBLIC_RECAPTCHA_VERIFY_URL) ||
    '';
  if (!verifyUrl || !token) return true;

  try {
    const resp = await fetch(verifyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, action }),
    });
    const data = await resp.json();
    return Boolean(data && (data.ok === true || data.valid === true));
  } catch (_e) {
    return false;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = React.useCallback(async () => {
    try {
      if (typeof window !== 'undefined') {
        const token = await getRecaptchaToken('LOGIN');
        const valid = await verifyRecaptchaToken(token, 'LOGIN');
        if (!valid) {
          console.warn('reCAPTCHA validation failed');
          return null;
        }
      }
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.warn('Google sign-in failed:', error.message);
      return null;
    }
  }, []);

  const signOut = React.useCallback(async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.warn('Sign-out failed:', error.message);
    }
  }, []);

  const value = React.useMemo(
    () => ({ user, loading, signInWithGoogle, signOut }),
    [user, loading, signInWithGoogle, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return React.useContext(AuthContext);
}
