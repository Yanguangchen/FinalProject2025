import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform, Modal } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import levelsJson from '../levels.json';
import ButtonShort from '../UI/button-short';
import { useNavigation } from '@react-navigation/native';
import { useProgress } from '../context/ProgressContext';

export default function Map() {
  const nav = useNavigation();
  const { currentLevel, currentQuizIndex, showCongrats, setShowCongrats } = useProgress();
  const levels = (levelsJson && levelsJson.levels) || [];
  const activeLevel = levels.find((l) => l.level_id === currentLevel) || levels[0];
  const numNodes = (activeLevel && activeLevel.quizzes && activeLevel.quizzes.length) || 4;

  const handleBack = React.useCallback(() => {
    try {
      nav.navigate('Home');
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
      <Modal
        animationType="fade"
        transparent
        visible={showCongrats}
        onRequestClose={() => setShowCongrats(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Great job!</Text>
            <Text style={styles.modalBody}>You completed the quiz. Ready for the next step?</Text>
            <ButtonShort title="Continue" onPress={() => setShowCongrats(false)} style={styles.modalButton} />
          </View>
        </View>
      </Modal>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          aria-label="Go back"
          onPress={handleBack}
          style={styles.backHit}
        >
          <Ionicons
            name="chevron-back"
            size={28}
            color="#000"
            accessibilityRole="image"
            accessibilityLabel="Back arrow icon"
            aria-label="Back arrow icon"
          />
        </Pressable>
        <View style={styles.counters}>
          <View style={styles.counterItem}>
            <Ionicons
              name="flame"
              size={18}
              color="#FF9800"
              accessibilityRole="image"
              accessibilityLabel="Flame icon"
              aria-label="Flame icon"
            />
            <Text style={styles.counterText}>30</Text>
          </View>
          <View style={styles.counterItem}>
            <Ionicons
              name="cube"
              size={18}
              color="#00C853"
              accessibilityRole="image"
              accessibilityLabel="Cube icon"
              aria-label="Cube icon"
            />
            <Text style={styles.counterText}>1000</Text>
          </View>
          <View style={styles.counterItem}>
            <Ionicons
              name="heart"
              size={18}
              color="#FF5252"
              accessibilityRole="image"
              accessibilityLabel="Heart icon"
              aria-label="Heart icon"
            />
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

        {/* Path of nodes */}
        <View style={styles.pathWrap}>
          {nodes.map((n, index) => {
            // Zig-zag horizontally
            const leftCurrent = index % 2 === 0 ? '18%' : '62%';
            const quizIdx = Math.max(0, Number(currentQuizIndex) || 0);
            const activeNode = quizIdx >= numNodes ? 0 : quizIdx + 1;
            const isActive = activeNode > 0 && n === activeNode;
            const isCompleted = quizIdx >= n;
            const isBeginNode = n === 1;
            return (
              <React.Fragment key={`node-${n}`}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={
                    isBeginNode
                      ? isCompleted && !isActive
                        ? 'Begin completed'
                        : 'Begin'
                      : isCompleted && !isActive
                        ? `Quiz ${n} completed`
                        : `Quiz ${n}`
                  }
                  aria-label={
                    isBeginNode
                      ? isCompleted && !isActive
                        ? 'Begin completed'
                        : 'Begin'
                      : isCompleted && !isActive
                        ? `Quiz ${n} completed`
                        : `Quiz ${n}`
                  }
                  onPress={() => gotoLevel(n)}
                  style={[
                    styles.node,
                    { alignSelf: 'flex-start', marginLeft: leftCurrent },
                    isActive ? styles.nodeActive : isCompleted ? styles.nodeCompleted : styles.nodeIdle,
                  ]}
                >
                  {isBeginNode ? (
                    <Text
                      style={
                        isActive
                          ? styles.nodeTextBegin
                          : isCompleted
                            ? styles.nodeTextCompleted
                            : styles.nodeText
                      }
                    >
                      BEGIN!
                    </Text>
                  ) : (
                    <Text
                      style={
                        isActive
                          ? styles.nodeTextActive
                          : isCompleted
                            ? styles.nodeTextCompleted
                            : styles.nodeText
                      }
                    >
                      {String(n)}
                    </Text>
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

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#E7E4E7',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#2db200',
    marginBottom: 6,
    fontFamily: 'Acme_400Regular',
  },
  modalBody: {
    fontSize: 14,
    color: '#4B4B4B',
    textAlign: 'center',
    marginBottom: 14,
  },
  modalButton: { width: '60%' },

  pathWrap: {
    marginTop: 18,
    paddingBottom: 20,
  },
  connector: {
    width: '40%',
    height: 0,
    borderTopWidth: 6,
    borderStyle: 'dotted',
    borderColor: '#D9D9D9',
    marginTop: -6,
    marginBottom: 6,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    zIndex: 0,
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
    zIndex: 1,
  },
  nodeIdle: { backgroundColor: '#EAEAEA' },
  nodeCompleted: { backgroundColor: '#CFCFCF' },
  nodeActive: { backgroundColor: '#2db200' },
  nodeText: { fontWeight: '900', color: '#4B4B4B', fontSize: 16 },
  nodeTextActive: { fontWeight: '900', color: '#fff', fontSize: 16 },
  nodeTextBegin: { fontWeight: '900', color: '#fff', fontSize: 12 },
  nodeTextCompleted: { fontWeight: '900', color: '#6B6B6B', fontSize: 16 },
});


