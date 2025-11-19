import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

/**
 * Short primary button used across the app.
 * Props:
 * - title: string
 * - onPress: () => void
 * - style: ViewStyle (optional) - extra container styles
 * - textStyle: TextStyle (optional) - extra text styles
 */
export default function ButtonShort({ title, onPress, style, textStyle }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.ctaButton, pressed && styles.ctaButtonPressed, style]}
    >
      <Text style={[styles.ctaText, textStyle]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  ctaButton: {
    backgroundColor: '#2db200',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    alignSelf: 'center',
    width: '43%',
  },
  ctaButtonPressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
  ctaText: { color: '#fff', fontWeight: '800', letterSpacing: 1, fontSize: 16, fontFamily: 'Acme_400Regular' },
});

