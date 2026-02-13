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
import Level1Screen from './screens/Level1Screen';
import Level2Screen from './screens/Level2Screen';
import Level3Screen from './screens/Level3Screen';
import Level4Screen from './screens/Level4Screen';
import Level5Screen from './screens/Level5Screen';
import MapScreen from './screens/Map';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProgressProvider } from './context/ProgressContext';
import { NetworkProvider } from './context/NetworkContext';
import { AuthProvider } from './context/AuthContext';
import { CloudSyncProvider } from './context/CloudSyncContext';
import CloudSyncBridge from './context/CloudSyncBridge';
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
      const path = window.location.pathname || '/';
      const base = webBasePath || '';
      const atBaseOnly =
        path === base ||
        path === base + '/' ||
        (base === '' && (path === '/' || path === ''));
      // Honor deep links: only restore saved state when we're at the app root
      if (atBaseOnly) {
        const saved = window.sessionStorage.getItem(PERSISTENCE_KEY);
        if (saved) setInitialNavState(JSON.parse(saved));
      }
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
      ? {
          prefixes: [window.location.origin + webBasePath],
          config: {
            screens: {
              Home: '',
              Level1: 'level/1',
              Level2: 'level/2',
              Level3: 'level/3',
              Level4: 'level/4',
              Level5: 'level/5',
              ShelterMap: 'shelters',
              ElevationMap: 'elevation',
              Preparation: 'prepare',
              OfficialUpdates: 'updates',
              LanguageSelect: 'language',
              Welcome: 'welcome',
              Map: 'map',
            },
          },
        }
      : undefined;

  return (
    <NetworkProvider>
      <AuthProvider>
        <ProgressProvider>
          <CloudSyncProvider>
            <CloudSyncBridge />
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
            <Stack.Screen name="Level1" component={Level1Screen} />
            <Stack.Screen name="Level2" component={Level2Screen} />
            <Stack.Screen name="Level3" component={Level3Screen} />
            <Stack.Screen name="Level4" component={Level4Screen} />
            <Stack.Screen name="Level5" component={Level5Screen} />
            <Stack.Screen name="Map" component={MapScreen} />
            <Stack.Screen name="ShelterMap" component={ShelterMapScreen} />
            <Stack.Screen name="ElevationMap" component={ElevationMapScreen} />
            <Stack.Screen name="Preparation" component={PreparationScreen} />
            <Stack.Screen name="OfficialUpdates" component={OfficialUpdates} />
          </Stack.Navigator>
          <StatusBar style="auto" />
        </NavigationContainer>
        ) : null}
        <ConnectionBanner />
          </CloudSyncProvider>
        </ProgressProvider>
      </AuthProvider>
    </NetworkProvider>
  );
}

// No screen-specific styles here; screens manage their own styles.

