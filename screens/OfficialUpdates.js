import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, Platform, ScrollView } from 'react-native';
import ArrowBack from '../UI/arrow-back';
import StatusCard from '../UI/status-card';
import { useNavigation } from '@react-navigation/native';

export default function OfficialUpdates() {
  const navigation = useNavigation();

  // General RSS feed (replaces the weather widget)
  const RssGeneralWidget = React.useCallback(() => {
    React.useEffect(() => {
      if (Platform.OS !== 'web') return;
      const host = document.getElementById('rssapp-container-g2');
      if (host && !host.querySelector('rssapp-feed')) {
        const el = document.createElement('rssapp-feed');
        el.setAttribute('id', 'X3DIbxijyrFdfjI1');
        host.appendChild(el);
      }
      if (!document.getElementById('rssapp-feed-js')) {
        const s = document.createElement('script');
        s.id = 'rssapp-feed-js';
        s.async = true;
        s.src = 'https://widget.rss.app/v1/feed.js';
        document.body.appendChild(s);
      }
    }, []);

    if (Platform.OS !== 'web') {
      return <StatusCard title="Official Updates" subtitle="Unavailable on native" />;
    }
    return (
      <StatusCard title="Official Updates">
        <View nativeID="rssapp-container-g2" style={styles.rssContainer} />
      </StatusCard>
    );
  }, []);

  const RssWidget = React.useCallback(() => {
    React.useEffect(() => {
      if (Platform.OS !== 'web') return;
      const host = document.getElementById('rssapp-container');
      if (host && !host.querySelector('rssapp-list')) {
        const el = document.createElement('rssapp-list');
        el.setAttribute('id', 'xBoCmprkh37V1t7g');
        host.appendChild(el);
      }
      if (!document.getElementById('rssapp-list-js')) {
        const s = document.createElement('script');
        s.id = 'rssapp-list-js';
        s.async = true;
        s.src = 'https://widget.rss.app/v1/list.js';
        document.body.appendChild(s);
      }
    }, []);

    if (Platform.OS !== 'web') {
      return <StatusCard title="SCDF Updates" subtitle="Unavailable on native" />;
    }
    return (
      <StatusCard title="SCDF Updates">
        <View nativeID="rssapp-container" style={styles.rssContainer} />
      </StatusCard>
    );
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <ArrowBack onPress={() => navigation.goBack()} />
          <Text style={styles.title}>OFFICIAL UPDATES</Text>
        </View>
        <View style={{ height: 12 }} />
        <RssGeneralWidget />
        <View style={{ height: 12 }} />
        <RssWidget />
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#B884FF',
    marginLeft: 6,
    letterSpacing: 1,
    fontFamily: 'Acme_400Regular',
  },
  weatherContainer: {
    width: '100%',
    minHeight: 120,
    alignSelf: 'center',
  },
  rssContainer: {
    width: '100%',
    minHeight: 300,
    alignSelf: 'center',
  },
});


