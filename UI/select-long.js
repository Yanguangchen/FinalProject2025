import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';

/**
 * Long selectable option row.
 * Props:
 * - label: string
 * - selected: boolean
 * - onPress: () => void
 */
export default function SelectLong({ label, selected = false, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        selected ? styles.selected : styles.unselected,
        styles.neumorphicShadow,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#4B4B4B',
    marginVertical: 8,
  },
  unselected: {
    backgroundColor: '#FFFFFF',
  },
  selected: {
    backgroundColor: '#0022FF',
    borderColor: '#0022FF',
  },
  // Subtle neumorphic drop shadow
  neumorphicShadow: {
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  pressed: {
    opacity: 0.96,
  },
  label: {
    color: '#4B4B4B',
    fontSize: 18,
    fontWeight: '800',
    fontFamily: 'Acme_400Regular',
  },
  labelSelected: {
    color: '#FFFFFF',
  },
});

