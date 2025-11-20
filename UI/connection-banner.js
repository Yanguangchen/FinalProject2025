import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNetwork } from '../context/NetworkContext';

export default function ConnectionBanner() {
  const { isConnected } = useNetwork();
  if (isConnected) return null;
  return (
    <View style={styles.banner} pointerEvents="none">
      <Text style={styles.text}>Signal Lost: No real time alerts</Text>
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
  },
  text: {
    color: '#fff',
    fontWeight: '800',
    textAlign: 'center',
  },
});


