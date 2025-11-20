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
        pressed ? styles.active : styles.raised,
        selected ? styles.shadowSelected : styles.shadowNeutral,
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
  // Raised 3D
  raised: {
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  shadowSelected: {
    // darker shade of accent blue
    shadowColor: '#0017B3',
  },
  shadowNeutral: {
    // darker shade of neutral gray
    shadowColor: '#7A7A7A',
  },
  // Active/pressed state
  active: {
    shadowOpacity: 0,
    elevation: 0,
    transform: [{ translateY: 4 }],
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

