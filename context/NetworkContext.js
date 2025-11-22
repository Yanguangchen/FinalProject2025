import React from 'react';
import NetInfo from '@react-native-community/netinfo';
import { Platform } from 'react-native';

const PING_URL = 'https://www.gstatic.com/generate_204';
const PING_TIMEOUT_MS = 5000;
const PING_INTERVAL_MS = 15000;

async function measurePing() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), PING_TIMEOUT_MS);
  const startedAt = Date.now();
  try {
    const resp = await fetch(PING_URL, {
      method: 'GET',
      signal: controller.signal,
      cache: 'no-store',
      // On web, avoid CORS preflight/errors; we only need RTT, not response body
      ...(Platform.OS === 'web' ? { mode: 'no-cors' } : {}),
    });
    if (!resp.ok && resp.status !== 204) {
      // still count the RTT if reachable
    }
    const rtt = Date.now() - startedAt;
    clearTimeout(timeoutId);
    return rtt;
  } catch (_e) {
    clearTimeout(timeoutId);
    return null;
  }
}

function classifyStrength(pingMs, isConnected) {
  if (!isConnected) return 'No connection';
  if (pingMs == null) return 'Unknown';
  if (pingMs < 100) return 'Strong';
  if (pingMs < 300) return 'Moderate';
  return 'Weak';
}

const NetworkContext = React.createContext({
  isConnected: true,
  pingMs: null,
  strength: 'Unknown',
});

export function NetworkProvider({ children }) {
  const [isConnected, setIsConnected] = React.useState(true);
  const [pingMs, setPingMs] = React.useState(null);

  React.useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(Boolean(state.isConnected && state.isInternetReachable !== false));
    });
    return () => unsubscribe && unsubscribe();
  }, []);

  React.useEffect(() => {
    let mounted = true;
    let intervalId;
    const run = async () => {
      const rtt = await measurePing();
      if (mounted) setPingMs(rtt);
    };
    run();
    intervalId = setInterval(run, PING_INTERVAL_MS);
    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const strength = classifyStrength(pingMs, isConnected);

  const value = React.useMemo(() => ({ isConnected, pingMs, strength }), [isConnected, pingMs, strength]);
  return <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>;
}

export function useNetwork() {
  return React.useContext(NetworkContext);
}


