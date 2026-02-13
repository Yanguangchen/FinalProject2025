import React from 'react';

const ProgressContext = React.createContext({
  progress: 0,
  currentLevel: 1,
  currentQuizIndex: 0,
  showCongrats: false,
  cloudLoaded: false,
  setProgress: (_v) => {},
  setCurrentLevel: (_v) => {},
  setCurrentQuizIndex: (_v) => {},
  setShowCongrats: (_v) => {},
  advance: (_delta) => {},
  retreat: (_delta) => {},
  resetProgress: () => {},
  reset: () => {},
  syncToCloud: () => {},
  loadFromCloud: async () => {},
});

export function ProgressProvider({ children }) {
  const [progress, setProgressState] = React.useState(0);
  const [currentLevel, setCurrentLevelState] = React.useState(1);
  const [currentQuizIndex, setCurrentQuizIndexState] = React.useState(0);
  const [showCongrats, setShowCongratsState] = React.useState(false);
  const [cloudLoaded, setCloudLoaded] = React.useState(false);

  // Cloud sync callbacks injected by CloudSyncBridge (set after mount)
  const cloudSaveRef = React.useRef(null);
  const cloudLoadRef = React.useRef(null);

  const setProgress = React.useCallback((value) => {
    const clamped = Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
    setProgressState(clamped);
  }, []);

  const setCurrentLevel = React.useCallback((value) => {
    const next = Math.max(1, Number.isFinite(value) ? value : 1);
    setCurrentLevelState(next);
  }, []);

  const setCurrentQuizIndex = React.useCallback((value) => {
    const next = Math.max(0, Number.isFinite(value) ? value : 0);
    setCurrentQuizIndexState(next);
  }, []);

  const setShowCongrats = React.useCallback((value) => {
    setShowCongratsState(Boolean(value));
  }, []);

  const advance = React.useCallback((delta) => {
    setProgressState((p) => Math.max(0, Math.min(1, p + (Number.isFinite(delta) ? delta : 0))));
  }, []);

  const retreat = React.useCallback((delta) => {
    setProgressState((p) => Math.max(0, Math.min(1, p - (Number.isFinite(delta) ? delta : 0))));
  }, []);

  const reset = React.useCallback(() => {
    setProgressState(0);
    setCurrentLevelState(1);
    setCurrentQuizIndexState(0);
    setShowCongratsState(false);
  }, []);

  const resetProgress = React.useCallback(() => {
    setProgressState(0);
  }, []);

  const syncToCloud = React.useCallback(() => {
    if (cloudSaveRef.current) {
      cloudSaveRef.current();
    }
  }, []);

  const loadFromCloud = React.useCallback(async () => {
    if (cloudLoadRef.current) {
      const data = await cloudLoadRef.current();
      if (data) {
        if (typeof data.currentLevel === 'number') setCurrentLevelState(data.currentLevel);
        if (typeof data.currentQuizIndex === 'number') setCurrentQuizIndexState(data.currentQuizIndex);
        setCloudLoaded(true);
        return data;
      }
    }
    return null;
  }, []);

  const value = React.useMemo(
    () => ({
      progress,
      currentLevel,
      currentQuizIndex,
      showCongrats,
      cloudLoaded,
      setProgress,
      setCurrentLevel,
      setCurrentQuizIndex,
      setShowCongrats,
      advance,
      retreat,
      resetProgress,
      reset,
      syncToCloud,
      loadFromCloud,
      _cloudSaveRef: cloudSaveRef,
      _cloudLoadRef: cloudLoadRef,
    }),
    [
      progress,
      currentLevel,
      currentQuizIndex,
      showCongrats,
      cloudLoaded,
      setProgress,
      setCurrentLevel,
      setCurrentQuizIndex,
      setShowCongrats,
      advance,
      retreat,
      resetProgress,
      reset,
      syncToCloud,
      loadFromCloud,
    ]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  return React.useContext(ProgressContext);
}


