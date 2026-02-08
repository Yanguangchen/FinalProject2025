import React from 'react';

const ProgressContext = React.createContext({
  progress: 0,
  currentLevel: 1,
  currentQuizIndex: 0,
  showCongrats: false,
  setProgress: (_v) => {},
  setCurrentLevel: (_v) => {},
  setCurrentQuizIndex: (_v) => {},
  setShowCongrats: (_v) => {},
  advance: (_delta) => {},
  retreat: (_delta) => {},
  resetProgress: () => {},
  reset: () => {},
});

export function ProgressProvider({ children }) {
  const [progress, setProgressState] = React.useState(0);
  const [currentLevel, setCurrentLevelState] = React.useState(1);
  const [currentQuizIndex, setCurrentQuizIndexState] = React.useState(0);
  const [showCongrats, setShowCongratsState] = React.useState(false);

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

  const value = React.useMemo(
    () => ({
      progress,
      currentLevel,
      currentQuizIndex,
      showCongrats,
      setProgress,
      setCurrentLevel,
      setCurrentQuizIndex,
      setShowCongrats,
      advance,
      retreat,
      resetProgress,
      reset,
    }),
    [
      progress,
      currentLevel,
      currentQuizIndex,
      showCongrats,
      setProgress,
      setCurrentLevel,
      setCurrentQuizIndex,
      setShowCongrats,
      advance,
      retreat,
      resetProgress,
      reset,
    ]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  return React.useContext(ProgressContext);
}


