import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNetwork } from '../context/NetworkContext';

export default function ConnectionBanner() {
  const { isConnected } = useNetwork();
  const [minimized, setMinimized] = useState(false);

  // Reset to expanded whenever the connection drops again
  useEffect(() => {
    if (!isConnected) setMinimized(false);
  }, [isConnected]);

  if (isConnected) return null;

  if (minimized) {
    return (
      <Pressable
        style={styles.minimizedBanner}
        onPress={() => setMinimized(false)}
        accessibilityRole="button"
        accessibilityLabel="Expand connection alert"
      >
        <Text style={styles.minimizedDot}>{'●'}</Text>
        <Text style={styles.minimizedText}>Signal Lost</Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.banner}>
      <Text style={styles.text}>Signal Lost: No real time alerts</Text>
      <Pressable
        style={styles.minimizeButton}
        onPress={() => setMinimized(true)}
        accessibilityRole="button"
        accessibilityLabel="Minimize alert"
        hitSlop={8}
      >
        <Text style={styles.minimizeIcon}>{'▲'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#8A0000',
    paddingVertical: 10,
    paddingHorizontal: 12,
    zIndex: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: '800',
    textAlign: 'center',
    flex: 1,
  },
  minimizeButton: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  minimizeIcon: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
  minimizedBanner: {
    position: 'absolute',
    top: 6,
    right: 12,
    backgroundColor: '#8A0000',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    zIndex: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  minimizedDot: {
    color: '#FF5C5C',
    fontSize: 10,
  },
  minimizedText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
  },
});


