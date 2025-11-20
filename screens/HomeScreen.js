import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView } from 'react-native';
import ButtonShort from '../UI/button-short';
import ButtonLong from '../UI/button-long';
import StatusCard from '../UI/status-card';
import SignalIndicator from '../UI/signal-indicator';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>CURRENT STATUS</Text>
        <StatusCard title="High Alert" subtitle="Flood Risk" variant="alert" />
        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <StatusCard title="Incoming" subtitle="Aid Airdrops" compact />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <StatusCard title="Government Alerts" subtitle="Get the latest update" compact />
          </View>
        </View>

        <Text style={styles.sectionTitle}>DASHBOARD</Text>
        <StatusCard title="Martial Law Enacted" subtitle="15/11/2025    5:33am" />
        <View style={[styles.row, { justifyContent: 'space-between', width: '92%', alignSelf: 'center' }]}>
          <ButtonShort title="Elevation Map" onPress={() => navigation.navigate('ElevationMap')} style={{ width: '43%' }} />
          <ButtonShort title="Shelter Map" onPress={() => navigation.navigate('ShelterMap')} style={{ width: '43%' }} />
        </View>
        <View style={{ height: 24 }} />
        <ButtonLong title="Preparation" onPress={() => {}} />
        <View style={{ height: 16 }} />
        <SignalIndicator strength="Strong" pingMs={40} />
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 16 },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#B884FF',
    marginTop: 8,
    marginBottom: 8,
    letterSpacing: 1,
    fontFamily: 'Acme_400Regular',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
});

