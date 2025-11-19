import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View } from 'react-native';
import { useFonts, Acme_400Regular } from '@expo-google-fonts/acme';
import WelcomeScreen from './screens/WelcomeScreen';
import LanguageSelect from './screens/LanguageSelect';
import HomeScreen from './screens/HomeScreen';
import ShelterMapScreen from './screens/ShelterMapScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProgressProvider } from './context/ProgressContext';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({ Acme_400Regular });
  if (!fontsLoaded) {
    return null;
  }

  return (
    <ProgressProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
          initialRouteName="Welcome"
        >
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="LanguageSelect" component={LanguageSelect} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="ShelterMap" component={ShelterMapScreen} />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </ProgressProvider>
  );
}

// No screen-specific styles here; screens manage their own styles.

