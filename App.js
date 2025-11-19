import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View } from 'react-native';
import { useFonts, Acme_400Regular } from '@expo-google-fonts/acme';
import WelcomeScreen from './screens/WelcomeScreen';

export default function App() {
  const [fontsLoaded] = useFonts({ Acme_400Regular });
  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <WelcomeScreen />
      <StatusBar style="auto" />
    </View>
  );
}

// No screen-specific styles here; screens manage their own styles.

