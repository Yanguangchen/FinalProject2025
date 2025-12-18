import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View } from 'react-native';
import { useFonts, Acme_400Regular } from '@expo-google-fonts/acme';
import WelcomeScreen from './screens/WelcomeScreen';
import LanguageSelect from './screens/LanguageSelect';
import HomeScreen from './screens/HomeScreen';
import ShelterMapScreen from './screens/ShelterMapScreen';
import ElevationMapScreen from './screens/ElevationMapScreen';
import PreparationScreen from './screens/PreparationScreen';
import OfficialUpdates from './screens/OfficialUpdates';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProgressProvider } from './context/ProgressContext';
import { NetworkProvider } from './context/NetworkContext';
import ConnectionBanner from './UI/connection-banner';
import { Platform } from 'react-native';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({ Acme_400Regular });

  // Persist navigation state on web so refresh doesn't reset to Welcome
  const PERSISTENCE_KEY = 'NAVIGATION_STATE_V1';
  const [isNavReady, setIsNavReady] = React.useState(Platform.OS !== 'web');
  const [initialNavState, setInitialNavState] = React.useState(undefined);

  React.useEffect(() => {
    if (Platform.OS !== 'web') return;
    try {
      const saved = window.sessionStorage.getItem(PERSISTENCE_KEY);
      if (saved) setInitialNavState(JSON.parse(saved));
    } catch (_e) {}
    setIsNavReady(true);
  }, []);

  if (!fontsLoaded) {
    // Render app while fonts load to avoid blank screen on web
    // Text will swap to custom font once loaded
  }

  // Base path for GitHub Pages (e.g., /FinalProject2025), injected via EXPO_PUBLIC_BASE_PATH
  const webBasePath =
    (typeof process !== 'undefined' && process.env && process.env.EXPO_PUBLIC_BASE_PATH) || '';
  const linking =
    Platform.OS === 'web' && typeof window !== 'undefined'
      ? { prefixes: [window.location.origin + webBasePath] }
      : undefined;

  return (
    <NetworkProvider>
      <ProgressProvider>
        {isNavReady ? (
        <NavigationContainer
          linking={linking}
          initialState={initialNavState}
          onStateChange={(state) => {
            if (Platform.OS === 'web') {
              try { window.sessionStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state)); } catch (_e) {}
            }
          }}
        >
          <Stack.Navigator
            screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
            initialRouteName="Welcome"
          >
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="LanguageSelect" component={LanguageSelect} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="ShelterMap" component={ShelterMapScreen} />
            <Stack.Screen name="ElevationMap" component={ElevationMapScreen} />
            <Stack.Screen name="Preparation" component={PreparationScreen} />
            <Stack.Screen name="OfficialUpdates" component={OfficialUpdates} />
          </Stack.Navigator>
          <StatusBar style="auto" />
        </NavigationContainer>
        ) : null}
        <ConnectionBanner />
      </ProgressProvider>
    </NetworkProvider>
  );
}

// No screen-specific styles here; screens manage their own styles.

