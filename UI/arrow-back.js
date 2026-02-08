import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

/**
 * ArrowBack
 * Props:
 * - onPress: () => void
 * - color?: string
 * - size?: number
 */
export default function ArrowBack({ onPress, color = '#4B4B4B', size = 28 }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Go back"
      aria-label="Go back"
      onPress={onPress}
      style={styles.hit}
    >
      <Ionicons
        name="chevron-back"
        size={size}
        color={color}
        accessibilityRole="image"
        accessibilityLabel="Back arrow icon"
        aria-label="Back arrow icon"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hit: { padding: 8 },
});

