import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import ProgressBar from './progress-bar';
import ButtonShort from './button-short';
import { useProgress } from '../context/ProgressContext';
import { useNavigation } from '@react-navigation/native';

/**
 * FourOptions
 * Props:
 * - title: string
 * - subtitle?: string
 * - options: string[] (expects 4 items; extra items are ignored)
 * - onClose?: () => void   // default: navigate to 'Home'
 * - onMoveOn?: (selected: string[]) => void
 */
export default function FourOptions({ title, subtitle, options = [], onClose, onMoveOn }) {
  const nav = useNavigation();
  const { progress, advance } = useProgress();
  const four = (options || []).slice(0, 4);
  const [selected, setSelected] = React.useState(() => Array(four.length).fill(false));

  const handleToggle = React.useCallback(
    (idx) => {
      setSelected((cur) => {
        const next = [...cur];
        next[idx] = !next[idx];
        return next;
      });
    },
    [setSelected]
  );

  const handleSelectAll = React.useCallback(() => {
    setSelected(Array(four.length).fill(true));
  }, [four.length]);

  const handleClose = React.useCallback(() => {
    if (typeof onClose === 'function') {
      onClose();
      return;
    }
    try {
      if (nav && typeof nav.navigate === 'function') {
        nav.navigate('Home');
      }
    } catch (_e) {}
  }, [nav, onClose]);

  const handleMoveOn = React.useCallback(() => {
    const chosen = four.filter((_, i) => selected[i]);
    advance(0.25);
    if (typeof onMoveOn === 'function') onMoveOn(chosen);
  }, [advance, four, selected, onMoveOn]);

  return (
    <View style={styles.container}>
      {/* Header Row: Close + Progress */}
      <View style={styles.header}>
        <Pressable accessibilityRole="button" onPress={handleClose} style={styles.closeHit}>
          <Ionicons name="close" size={30} color="#4B4B4B" />
        </Pressable>
        <View style={styles.progressWrapper}>
          <ProgressBar progress={progress} height={10} />
        </View>
      </View>

      {/* Titles */}
      <View style={styles.titleBlock}>
        <Text style={styles.overline}>LETS PREPARE</Text>
        {title ? <Text style={styles.title}>{title}</Text> : null}
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        <Pressable onPress={handleSelectAll} accessibilityRole="button">
          <Text style={styles.selectAll}>Select All</Text>
        </Pressable>
      </View>

      {/* Grid: 2 x 2 */}
      <View style={styles.gridWrapper}>
        <View style={styles.grid}>
          {four.map((label, idx) => {
            const isOn = Boolean(selected[idx]);
            return (
              <Pressable
                key={label || idx}
                accessibilityRole="button"
                onPress={() => handleToggle(idx)}
                style={({ pressed }) => [
                  styles.tile,
                  isOn ? styles.tileSelected : styles.tileIdle,
                  pressed ? styles.tileActive : styles.tileRaised,
                ]}
              >
                <Text style={[styles.tileText, isOn && styles.tileTextSelected]}>{label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* CTA */}
      <View style={styles.footer}>
        <ButtonShort title="Ready to Move on?" onPress={handleMoveOn} style={styles.cta} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: Platform.OS === 'web' ? 8 : 4,
  },
  closeHit: { padding: 8 },
  progressWrapper: { flex: 1, marginLeft: 8, marginRight: 12, marginTop: 6 },

  titleBlock: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 },
  overline: { color: '#7A7A7A', fontWeight: '900', letterSpacing: 1, fontSize: 12 },
  title: {
    marginTop: 8,
    fontSize: 22,
    fontWeight: '900',
    color: '#4B4B4B',
    letterSpacing: 0.5,
    lineHeight: 28,
    fontFamily: 'Acme_400Regular',
  },
  subtitle: { marginTop: 6, fontSize: 14, color: '#7A7A7A' },
  selectAll: { marginTop: 10, fontSize: 12, fontWeight: '800', color: '#4B4B4B' },

  gridWrapper: { alignItems: 'center', marginTop: 8 },
  grid: {
    width: '92%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tile: {
    width: '48%',
    height: 140,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#E7E4E7',
    marginBottom: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  tileIdle: { backgroundColor: '#FFFFFF' },
  tileSelected: {
    backgroundColor: '#0022FF',
    borderColor: '#0022FF',
  },
  tileRaised: {
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  tileActive: {
    shadowOpacity: 0,
    elevation: 0,
    transform: [{ translateY: 4 }],
  },
  tileText: {
    color: '#4B4B4B',
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
    paddingHorizontal: 10,
    fontFamily: 'Acme_400Regular',
  },
  tileTextSelected: { color: '#FFFFFF' },

  footer: { alignItems: 'center', marginTop: 10, marginBottom: 18 },
  cta: { width: '60%' },
});


