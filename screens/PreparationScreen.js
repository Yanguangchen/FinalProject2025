import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView } from 'react-native';
import ButtonLong from '../UI/button-long';
import ArrowBack from '../UI/arrow-back';
import { useNavigation } from '@react-navigation/native';

export default function PreparationScreen() {
  const navigation = useNavigation();

  const items = [
    'Hurricane / Typhoon Preparation',
    'Flood Preparation',
    'Wild Fires',
    'Earthquakes',
    'Tsunami preparation',
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <ArrowBack onPress={() => navigation.goBack()} />
          <Text style={styles.title}>PREPARATION</Text>
        </View>
        <View style={{ height: 12 }} />
        <View style={styles.list}>
          {items.map((label) => (
            <View key={label} style={{ marginVertical: 10, width: '100%' }}>
              <ButtonLong
                title={label}
                onPress={() => {}}
                textStyle={styles.buttonTextSmall}
                style={styles.buttonFullWidth}
              />
            </View>
          ))}
        </View>
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 16, alignItems: 'stretch', justifyContent: 'center' },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#B884FF',
    marginLeft: 6,
    fontFamily: 'Acme_400Regular',
    letterSpacing: 1,
  },
  list: {
    alignItems: 'stretch',
    justifyContent: 'center',
    width: '100%',
  },
  buttonTextSmall: {
    fontSize: 14,
  },
  buttonFullWidth: {
    width: '100%',
  },
});


