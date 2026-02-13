import React from 'react';
import { useAuth } from './AuthContext';
import { useCloudSync } from './CloudSyncContext';
import { useProgress } from './ProgressContext';

/**
 * CloudSyncBridge
 * Connects the cloud sync layer to the progress context.
 * - On login: loads progress from Firestore.
 * - On level/quiz change: auto-saves to Firestore.
 * Renders nothing visible.
 */
export default function CloudSyncBridge() {
  const { user } = useAuth();
  const { saveProgress, loadProgress } = useCloudSync();
  const {
    currentLevel,
    currentQuizIndex,
    setCurrentLevel,
    setCurrentQuizIndex,
    _cloudSaveRef,
    _cloudLoadRef,
  } = useProgress();

  // Wire refs so ProgressContext can trigger cloud ops
  React.useEffect(() => {
    if (_cloudSaveRef) {
      _cloudSaveRef.current = () => {
        saveProgress({ currentLevel, currentQuizIndex });
      };
    }
    if (_cloudLoadRef) {
      _cloudLoadRef.current = loadProgress;
    }
  }, [saveProgress, loadProgress, currentLevel, currentQuizIndex, _cloudSaveRef, _cloudLoadRef]);

  // Auto-load from cloud when user logs in
  const hasLoadedRef = React.useRef(false);
  React.useEffect(() => {
    if (!user || hasLoadedRef.current) return;
    hasLoadedRef.current = true;
    (async () => {
      const data = await loadProgress();
      if (data) {
        if (typeof data.currentLevel === 'number') setCurrentLevel(data.currentLevel);
        if (typeof data.currentQuizIndex === 'number') setCurrentQuizIndex(data.currentQuizIndex);
      }
    })();
  }, [user, loadProgress, setCurrentLevel, setCurrentQuizIndex]);

  // Reset load flag when user logs out
  React.useEffect(() => {
    if (!user) {
      hasLoadedRef.current = false;
    }
  }, [user]);

  // Auto-save when level or quiz index changes (debounced)
  const saveTimerRef = React.useRef(null);
  React.useEffect(() => {
    if (!user) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveProgress({ currentLevel, currentQuizIndex });
    }, 1500);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [user, currentLevel, currentQuizIndex, saveProgress]);

  return null;
}
