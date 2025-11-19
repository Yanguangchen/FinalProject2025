import React from 'react';

const ProgressContext = React.createContext({
  progress: 0,
  setProgress: (_v) => {},
  advance: (_delta) => {},
  retreat: (_delta) => {},
  reset: () => {},
});

export function ProgressProvider({ children }) {
  const [progress, setProgressState] = React.useState(0);

  const setProgress = React.useCallback((value) => {
    const clamped = Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
    setProgressState(clamped);
  }, []);

  const advance = React.useCallback((delta) => {
    setProgressState((p) => Math.max(0, Math.min(1, p + (Number.isFinite(delta) ? delta : 0))));
  }, []);

  const retreat = React.useCallback((delta) => {
    setProgressState((p) => Math.max(0, Math.min(1, p - (Number.isFinite(delta) ? delta : 0))));
  }, []);

  const reset = React.useCallback(() => setProgressState(0), []);

  const value = React.useMemo(
    () => ({ progress, setProgress, advance, retreat, reset }),
    [progress, setProgress, advance, retreat, reset]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  return React.useContext(ProgressContext);
}


