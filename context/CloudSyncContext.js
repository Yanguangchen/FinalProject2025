import React from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const CloudSyncContext = React.createContext({
  syncEnabled: false,
  lastSynced: null,
  saveProgress: async (_data) => {},
  loadProgress: async () => null,
});

export function CloudSyncProvider({ children }) {
  const { user } = useAuth();
  const [lastSynced, setLastSynced] = React.useState(null);

  const syncEnabled = Boolean(user);

  const saveProgress = React.useCallback(
    async (data) => {
      if (!user) return;
      try {
        const ref = doc(db, 'userProgress', user.uid);
        await setDoc(
          ref,
          {
            currentLevel: data.currentLevel,
            currentQuizIndex: data.currentQuizIndex,
            updatedAt: new Date().toISOString(),
            email: user.email || null,
            displayName: user.displayName || null,
          },
          { merge: true }
        );
        setLastSynced(new Date());
      } catch (error) {
        console.warn('Cloud save failed:', error.message);
      }
    },
    [user]
  );

  const loadProgress = React.useCallback(async () => {
    if (!user) return null;
    try {
      const ref = doc(db, 'userProgress', user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setLastSynced(new Date());
        return snap.data();
      }
      return null;
    } catch (error) {
      console.warn('Cloud load failed:', error.message);
      return null;
    }
  }, [user]);

  const value = React.useMemo(
    () => ({ syncEnabled, lastSynced, saveProgress, loadProgress }),
    [syncEnabled, lastSynced, saveProgress, loadProgress]
  );

  return <CloudSyncContext.Provider value={value}>{children}</CloudSyncContext.Provider>;
}

export function useCloudSync() {
  return React.useContext(CloudSyncContext);
}
