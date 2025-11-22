import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * StatusCard
 * Props:
 * - title: string
 * - subtitle?: string
 * - variant?: 'alert' | 'neutral'
 * - compact?: boolean (smaller height/padding)
 * - children?: ReactNode (optional content area)
 */
export default function StatusCard({ title, subtitle, variant = 'neutral', compact = false, children }) {
  const isAlert = variant === 'alert';
  return (
    <View style={[
      styles.base,
      compact ? styles.compact : undefined,
      isAlert ? styles.alert : styles.neutral
    ]}>
      {title ? <Text style={[styles.title, isAlert && styles.titleAlert]}>{title}</Text> : null}
      {subtitle ? <Text style={[styles.subtitle, isAlert && styles.subtitleAlert]}>{subtitle}</Text> : null}
      {children ? <View style={styles.content}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 2,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  compact: {
    paddingVertical: 12,
  },
  alert: {
    borderColor: '#FF2D2D',
  },
  neutral: {
    borderColor: '#E7E4E7',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4B4B4B',
  },
  titleAlert: {
    color: '#B00000',
  },
  subtitle: {
    marginTop: 4,
    color: '#7A7A7A',
    fontSize: 14,
  },
  subtitleAlert: {
    color: '#7a0000',
  },
  content: {
    marginTop: 8,
  },
});

