import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image, Alert, Modal } from 'react-native';
import ButtonShort from '../UI/button-short';
import { useNavigation } from '@react-navigation/native';
import { useProgress } from '../context/ProgressContext';

export default function WelcomeScreen() {
  const navigation = useNavigation();
  const { setProgress, reset } = useProgress();
  const [showDisclaimer, setShowDisclaimer] = React.useState(true);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Modal
          animationType="fade"
          transparent
          visible={showDisclaimer}
          onRequestClose={() => setShowDisclaimer(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.disclaimerText}>
                THIS APP IS A{'\n'}
                SUPPLEMENTARY TOOL, NOT A{'\n'}
                REPLACEMENT FOR{'\n'}
                EMERGENCY SERVICES
              </Text>
              <Text style={[styles.disclaimerText, { marginTop: 24 }]}>
                ALWAYS FOLLOW THE ADVICE{'\n'}
                OF LOCAL AUTHORITIES IN AN{'\n'}
                EMERGENCY
              </Text>
              <ButtonShort
                title="Understood"
                onPress={() => setShowDisclaimer(false)}
                style={{ marginTop: 28 }}
              />
            </View>
          </View>
        </Modal>
        <View style={styles.spacerTop} />

        <View style={styles.mascotWrapper}>
          <Image
            accessibilityLabel="Firefighter mascot"
            source={require('../assets/Splash.png')}
            style={styles.mascot}
            resizeMode="contain"
          />
        </View>

        <View style={styles.brandBlock}>
          <Text accessibilityRole="header" style={styles.brand}>
            <Text style={styles.brandLeft}>RAL</Text>
            <Text style={styles.brandRight}>LY</Text>
          </Text>
          <Text style={styles.tagline}>Disaster Preparation</Text>
        </View>

        <ButtonShort
          title="GET STARTED"
          onPress={() => {
            reset();
            setProgress(0.1);
            navigation.navigate('LanguageSelect');
          }}
          style={{ marginTop: 24 }}
        />

        <View style={styles.spacerBottom} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  content: { flex: 1, alignItems: 'center' },
  spacerTop: { height: 48 },
  spacerBottom: { height: 40 },
  mascotWrapper: { width: '100%', alignItems: 'center', marginTop: 16, marginBottom: 24 },
  mascot: { width: 240, height: 240 },
  brandBlock: { alignItems: 'center', marginTop: 8, marginBottom: 16 },
  brand: {
    fontSize: 56,
    fontWeight: '800',
    letterSpacing: 2,
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 6,
    fontFamily: 'Acme_400Regular',
  },
  brandLeft: { color: '#10b4b4' },
  brandRight: { color: '#69c84a' },
  tagline: { marginTop: 8, fontSize: 16, color: '#222', opacity: 0.99, fontFamily: 'Acme_400Regular' },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
  },
  disclaimerText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '800',
    letterSpacing: 1,
    fontFamily: 'Acme_400Regular',
  },
});

