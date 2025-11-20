import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

/**
 * Long primary button that spans full width of its container.
 * Props:
 * - title: string
 * - onPress: () => void
 * - style?: ViewStyle
 * - textStyle?: TextStyle
 */
export default function ButtonLong({ title, onPress, style, textStyle }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed ? styles.buttonActive : styles.buttonRaised,
        style,
      ]}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2db200',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignSelf: 'center',
    width: '92%', // roughly 2.3x of a 40% short button
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonRaised: {
    // lighter shade of primary green for the drop shadow
    shadowColor: '#228A00',
    shadowOpacity: 0.35,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  buttonActive: {
    shadowOpacity: 0,
    elevation: 0,
    transform: [{ translateY: 4 }],
  },
  text: { color: '#fff', fontWeight: '800', fontSize: 18, letterSpacing: 0.5, fontFamily: 'Acme_400Regular' },
});

