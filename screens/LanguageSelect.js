import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ArrowBack from '../UI/arrow-back';
import ProgressBar from '../UI/progress-bar';
import SelectLong from '../UI/select-long';
import ButtonShort from '../UI/button-short';
import { useProgress } from '../context/ProgressContext';

const LANGS = ['Spanish', 'French', 'German', 'Italian', 'English', 'Japanese', 'Chinese'];

export default function LanguageSelect() {
  const navigation = useNavigation();
  const [selected, setSelected] = React.useState('French');
  const { progress, advance, retreat } = useProgress();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ArrowBack onPress={() => { retreat(0.1); navigation.goBack(); }} />
        <View style={styles.progressWrapper}>
          <ProgressBar progress={progress} height={10} />
        </View>
      </View>

      <View style={styles.speakerRow}>
        <Image
          source={require('../assets/Splash.png')}
          style={styles.mascotSmall}
          resizeMode="contain"
          accessibilityLabel="Firefighter mascot"
          aria-label="Firefighter mascot"
        />
        <View style={styles.speechBubble}>
          <Text style={styles.speechText}>Reconfirm your{'\n'}language</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Select your language</Text>
        <View style={{ height: 12 }} />
        {LANGS.map(lang => (
          <SelectLong
            key={lang}
            label={lang}
            selected={selected === lang}
            onPress={() => setSelected(lang)}
          />
        ))}
        <View style={{ height: 16 }} />
        <ButtonShort
          title="PROCEED"
          onPress={() => { advance(0.1); navigation.navigate('Home'); }}
          style={{ width: '92%', alignSelf: 'center' }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 4,
  },
  progressWrapper: { flex: 1, marginLeft: 8, marginRight: 12, marginTop: 8 },
  speakerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  mascotSmall: { width: 64, height: 64 },
  speechBubble: {
    marginLeft: 12,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 2,
    borderColor: '#E7E4E7',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  speechText: { fontSize: 16, fontWeight: '700', color: '#4B4B4B' },
  content: { padding: 16, paddingBottom: 32 },
  title: { fontSize: 20, fontWeight: '800', color: '#4B4B4B' },
});

