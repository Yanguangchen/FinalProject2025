import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, Platform, Pressable } from 'react-native';
import ButtonShort from '../UI/button-short';
import ButtonLong from '../UI/button-long';
import StatusCard from '../UI/status-card';
import SignalIndicator from '../UI/signal-indicator';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();

  const [scdfTitle, setScdfTitle] = React.useState(null);
  const [scdfDate, setScdfDate] = React.useState(null);

  // Some hosting environments (or extensions) apply a strict CSP that blocks 'unsafe-eval'.
  // Third-party widgets may rely on eval/new Function internally; allow disabling them via env.
  const disableThirdPartyWidgets =
    (typeof process !== 'undefined' &&
      process.env &&
      process.env.EXPO_PUBLIC_DISABLE_THIRD_PARTY_WIDGETS === '1') ||
    false;

  const WeatherWidget = React.useCallback(() => {
    React.useEffect(() => {
      if (Platform.OS !== 'web') return;
      if (disableThirdPartyWidgets) return;
      // Prepare container attributes per WeatherWidget.org embed
      const container = document.getElementById('ww_c34773be0d417');
      if (container) {
        container.setAttribute('v', '1.3');
        container.setAttribute('loc', 'id');
        container.setAttribute('a', '{"t":"horizontal","lang":"en","sl_lpl":1,"ids":["wl2912"],"font":"Arial","sl_ics":"one_a","sl_sot":"celsius","cl_bkg":"#FFFFFF00","cl_font":"#000000","cl_cloud":"#d4d4d4","cl_persp":"#2196F3","cl_sun":"#FFC107","cl_moon":"#FFC107","cl_thund":"#FF5722","el_whr":3}');
        // Optional fallback anchor
        if (!document.getElementById('ww_c34773be0d417_u')) {
          const a = document.createElement('a');
          a.href = 'https://weatherwidget.org/';
          a.id = 'ww_c34773be0d417_u';
          a.target = '_blank';
          a.textContent = 'Free weather widget';
          container.appendChild(a);
        }
      }
      // Inject the WeatherWidget script once
      if (!document.getElementById('weatherwidget-bootstrap')) {
        const script = document.createElement('script');
        script.id = 'weatherwidget-bootstrap';
        script.async = true;
        script.src = 'https://app3.weatherwidget.org/js/?id=ww_c34773be0d417';
        document.body.appendChild(script);
      }
    }, []);

    if (Platform.OS !== 'web') {
      return <StatusCard title="Weather" subtitle="Unavailable on native" />;
    }
    if (disableThirdPartyWidgets) {
      return <StatusCard title="Weather" subtitle="Disabled on this deployment (CSP-safe mode)" />;
    }
    return (
      <StatusCard title="Weather">
        <View nativeID="ww_c34773be0d417" style={styles.weatherContainer} />
      </StatusCard>
    );
  }, [disableThirdPartyWidgets]);

  React.useEffect(() => {
    let mounted = true;
    const FEED_URL = 'https://rss.app/feeds/xBoCmprkh37V1t7g.xml';

    function parseFirstItem(xml) {
      const itemMatch = xml.match(/<item>[\s\S]*?<\/item>/);
      if (!itemMatch) return null;
      const item = itemMatch[0];
      // Try CDATA first, then plain text
      const titleMatch =
        item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) ||
        item.match(/<title>(.*?)<\/title>/);
      const pubDateMatch = item.match(/<pubDate>(.*?)<\/pubDate>/);
      const title = titleMatch ? (titleMatch[1] || titleMatch[2]) : null;
      const pubDate = pubDateMatch ? pubDateMatch[1] : null;
      return { title, pubDate };
    }

    function formatPubDate(dateStr) {
      if (!dateStr) return null;
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return null;
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const yyyy = d.getFullYear();
      let hours = d.getHours();
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12;
      return `${dd}/${mm}/${yyyy}    ${hours}:${minutes}${ampm}`;
    }

    async function load() {
      try {
        const resp = await fetch(FEED_URL, { method: 'GET', cache: 'no-store' });
        const xmlText = await resp.text();
        const first = parseFirstItem(xmlText);
        if (!mounted || !first) return;
        setScdfTitle(first.title || 'SCDF Update');
        setScdfDate(formatPubDate(first.pubDate));
      } catch (_e) {
        if (!mounted) return;
        setScdfTitle(null);
        setScdfDate(null);
      }
    }

    load();
    const id = setInterval(load, 5 * 60 * 1000); // refresh every 5 minutes
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>CURRENT STATUS</Text>
        <WeatherWidget />
        <Pressable accessibilityRole="button" onPress={() => navigation.navigate('OfficialUpdates')}>
          <StatusCard title="Government Alerts" subtitle="Get the latest update" compact />
        </Pressable>

        <Text style={styles.sectionTitle}>DASHBOARD</Text>
        <Text style={styles.sectionCaption}>latest updates from SCDF</Text>
        <StatusCard
          title={scdfTitle || 'SCDF Updates'}
          subtitle={scdfDate || 'Fetching latest...'}
        />
        <View style={[styles.row, { justifyContent: 'space-between', width: '92%', alignSelf: 'center' }]}>
          <ButtonShort title="Elevation Map" onPress={() => navigation.navigate('ElevationMap')} style={{ width: '43%' }} />
          <ButtonShort title="Shelter Map" onPress={() => navigation.navigate('ShelterMap')} style={{ width: '43%' }} />
        </View>
        <View style={{ height: 12 }} />
        <ButtonLong title="Preparation Map" onPress={() => navigation.navigate('Map')} />
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
  sectionCaption: {
    fontSize: 14,
    color: '#7A7A7A',
    marginBottom: 4,
  },
  weatherContainer: {
    width: '100%',
    minHeight: 120,
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
});

