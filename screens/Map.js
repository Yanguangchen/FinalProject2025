import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import levelsJson from '../levels.json';
import ButtonShort from '../UI/button-short';
import { useNavigation } from '@react-navigation/native';

export default function Map() {
  const nav = useNavigation();
  const levels = (levelsJson && levelsJson.levels) || [];
  const numNodes = levels.length || 5;

  const handleBack = React.useCallback(() => {
    try {
      nav.goBack();
    } catch (_e) {}
  }, [nav]);

  const gotoLevel = React.useCallback(
    (n) => {
      const route = `Level${n}`;
      try {
        // Navigate if route exists
        nav.navigate(route);
      } catch (_e) {}
    },
    [nav]
  );

  const begin = React.useCallback(() => gotoLevel(1), [gotoLevel]);

  const nodes = React.useMemo(() => {
    const arr = [];
    for (let i = 1; i <= numNodes; i++) arr.push(i);
    return arr;
  }, [numNodes]);

  return (
    <View style={styles.container}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable accessibilityRole="button" onPress={handleBack} style={styles.backHit}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </Pressable>
        <View style={styles.counters}>
          <View style={styles.counterItem}>
            <Ionicons name="flame" size={18} color="#FF9800" />
            <Text style={styles.counterText}>30</Text>
          </View>
          <View style={styles.counterItem}>
            <Ionicons name="cube" size={18} color="#00C853" />
            <Text style={styles.counterText}>1000</Text>
          </View>
          <View style={styles.counterItem}>
            <Ionicons name="heart" size={18} color="#FF5252" />
            <Text style={styles.counterText}>15</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Series banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerOver}>Preparation Series</Text>
          <Text style={styles.bannerTitle}>Flood Preparation</Text>
        </View>

        {/* Begin button */}
        <View style={styles.beginWrap}>
          <Pressable accessibilityRole="button" onPress={begin} style={styles.beginButton}>
            <Text style={styles.beginText}>BEGIN!</Text>
            <View style={styles.starWrap}>
              <Ionicons name="star" size={22} color="#fff" />
            </View>
          </Pressable>
        </View>

        {/* Path of nodes */}
        <View style={styles.pathWrap}>
          {nodes.map((n, index) => {
            // Zig-zag horizontally
            const leftCurrent = index % 2 === 0 ? '18%' : '62%';
            const isActive = n === 1; // mark first as active
            return (
              <React.Fragment key={`node-${n}`}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => gotoLevel(n)}
                  style={[
                    styles.node,
                    { alignSelf: 'flex-start', marginLeft: leftCurrent },
                    isActive ? styles.nodeActive : styles.nodeIdle,
                  ]}
                >
                  {isActive ? (
                    <Ionicons name="star" size={18} color="#fff" />
                  ) : (
                    <Text style={styles.nodeText}>{String(n)}</Text>
                  )}
                </Pressable>
                {index < nodes.length - 1 ? (
                  <View
                    style={[
                      styles.connector,
                      // between current and next zig positions
                      {
                        alignSelf: 'flex-start',
                        marginLeft: '26%',
                        transform: [
                          {
                            rotate: (index % 2 === 0 ? 15 : -15) + 'deg',
                          },
                        ],
                      },
                    ]}
                  />
                ) : null}
              </React.Fragment>
            );
          })}
        </View>

        {/* Bottom CTA (optional duplicate for accessibility) */}
        <View style={{ alignItems: 'center', marginTop: 16, marginBottom: 24 }}>
          <ButtonShort title="Ready to Move on?" onPress={begin} style={{ width: '60%' }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: Platform.OS === 'web' ? 8 : 4,
  },
  backHit: { padding: 8 },
  counters: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingRight: 4 },
  counterItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  counterText: { fontWeight: '800', color: '#4B4B4B' },

  content: { paddingBottom: 24 },
  banner: {
    alignSelf: 'center',
    width: '86%',
    backgroundColor: '#4CAF50',
    borderRadius: 14,
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  bannerOver: { color: '#E7F7E7', fontWeight: '800', fontSize: 12 },
  bannerTitle: { color: '#fff', fontWeight: '900', fontSize: 18, marginTop: 2 },

  beginWrap: { alignItems: 'center', marginTop: 14 },
  beginButton: {
    backgroundColor: '#66BB6A',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  beginText: { color: '#fff', fontWeight: '900', fontSize: 14 },
  starWrap: {
    marginTop: 6,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#2db200',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  pathWrap: {
    marginTop: 18,
    paddingBottom: 20,
  },
  connector: {
    width: '40%',
    height: 6,
    backgroundColor: '#D9D9D9',
    borderRadius: 4,
    marginTop: -6,
    marginBottom: 6,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  node: {
    width: 68,
    height: 68,
    borderRadius: 34,
    marginVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  nodeIdle: { backgroundColor: '#EAEAEA' },
  nodeActive: { backgroundColor: '#2db200' },
  nodeText: { fontWeight: '900', color: '#4B4B4B', fontSize: 16 },
});


