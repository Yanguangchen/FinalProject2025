import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNetwork } from '../context/NetworkContext';

/**
 * SignalIndicator
 * Props:
 * - strength?: 'Strong' | 'Moderate' | 'Weak'
 * - pingMs?: number
 */
export default function SignalIndicator({ strength = 'Strong', pingMs = 40 }) {
  const net = useNetwork();
  const finalStrength = net?.strength ?? strength;
  const finalPing = net?.pingMs ?? pingMs;
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Signal: <Text style={styles.accent}>{finalStrength}</Text></Text>
      <Text style={styles.subtitle}>ping: {finalPing != null ? `${finalPing}ms` : 'n/a'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#E7E4E7',
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  title: { fontSize: 16, fontWeight: '800', color: '#4B4B4B' },
  accent: { color: '#2db200' },
  subtitle: { fontSize: 14, color: '#7a7a7a', marginTop: 4 },
});

