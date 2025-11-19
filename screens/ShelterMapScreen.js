import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, Platform } from 'react-native';
import ArrowBack from '../UI/arrow-back';
import ButtonShort from '../UI/button-short';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export default function ShelterMapScreen() {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapArea}>
        {Platform.OS === 'web' ? (
          // Temporary placeholder using the provided Google Maps iframe (web only)
          <iframe
            title="Shelter Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.7269006727456!2d103.94957009999999!3d1.3401915!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da3d235406d0cb%3A0xd0d464b7d1c77552!2sChangi%20General%20Hospital!5e0!3m2!1sen!2ssg!4v1763564494282!5m2!1sen!2ssg"
            style={{ border: 0, width: '100%', height: '100%' }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        ) : (
          <View style={styles.nativePlaceholder}>
            <Text style={styles.nativePlaceholderText}>Map placeholder (mobile)</Text>
          </View>
        )}
      </View>

      {/* Overlays */}
      <View style={styles.overlayTop}>
        <ArrowBack onPress={() => navigation.goBack()} />
        <ButtonShort title="Shelter Locations near me" onPress={() => {}} style={styles.pill} />
      </View>

      <View style={styles.overlayBottom}>
        <Ionicons name="home" size={22} color="#ffb300" style={{ marginRight: 10 }} />
        <Text style={styles.bottomText}>Shelter Locations</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  mapArea: { flex: 1 },
  nativePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eef2f4',
  },
  nativePlaceholderText: { color: '#4B4B4B', fontWeight: '700' },
  overlayTop: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pill: {
    width: '80%',
    alignSelf: 'center',
    marginLeft: 6,
  },
  overlayBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 8,
    marginHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E7E4E7',
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    width: '92%',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  bottomText: { fontSize: 18, fontWeight: '800', color: '#4B4B4B' },
});


