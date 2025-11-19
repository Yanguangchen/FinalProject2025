import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

/**
 * ProgressBar
 * Props:
 * - progress: number (0..1)
 * - height?: number
 */
export default function ProgressBar({ progress = 0, height = 10 }) {
  const clamped = Math.max(0, Math.min(1, progress));
  return (
    <View style={[styles.rail, { height }]}>
      <View style={styles.outline} />
      <LinearGradient
        colors={['#0D00CA', '#0022FF']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={[styles.fill, { width: `${clamped * 100}%`, height }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  rail: {
    width: '100%',
    backgroundColor: '#E7E4E7',
    borderRadius: 999,
    overflow: 'hidden',
    position: 'relative',
  },
  outline: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 999,
    pointerEvents: 'none',
  },
  fill: {
    borderRadius: 999,
  },
});

