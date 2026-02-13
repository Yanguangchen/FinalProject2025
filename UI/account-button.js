import React from 'react';
import { View, Text, StyleSheet, Pressable, Modal, Platform } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import ButtonShort from './button-short';
import { useAuth } from '../context/AuthContext';
import { useCloudSync } from '../context/CloudSyncContext';
import { useProgress } from '../context/ProgressContext';

/**
 * AccountButton
 * Shows a user icon; tapping opens a modal where users can optionally
 * sign in with Google or view their sync status. Cloud save is optional.
 */
export default function AccountButton() {
  const { user, signInWithGoogle, signOut } = useAuth();
  const { syncEnabled, lastSynced } = useCloudSync();
  const { currentLevel, currentQuizIndex, syncToCloud, loadFromCloud } = useProgress();
  const [showModal, setShowModal] = React.useState(false);
  const [isHumanChecked, setIsHumanChecked] = React.useState(false);

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={user ? 'Account settings' : 'Sign in'}
        aria-label={user ? 'Account settings' : 'Sign in'}
        onPress={() => {
          setIsHumanChecked(false);
          setShowModal(true);
        }}
        style={styles.iconHit}
      >
        <Ionicons
          name={user ? 'person-circle' : 'person-circle-outline'}
          size={32}
          color={user ? '#2db200' : '#7A7A7A'}
          accessibilityRole="image"
          accessibilityLabel="Account icon"
          aria-label="Account icon"
        />
      </Pressable>

      <Modal
        animationType="fade"
        transparent
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.card}>
            {user ? (
              <>
                <Ionicons name="person-circle" size={48} color="#2db200" />
                <Text style={styles.greeting}>
                  {user.displayName || user.email || 'Signed in'}
                </Text>
                <Text style={styles.subtitle}>
                  Cloud sync is active
                </Text>
                {lastSynced ? (
                  <Text style={styles.meta}>
                    Last synced: {lastSynced.toLocaleTimeString()}
                  </Text>
                ) : null}
                <Text style={styles.meta}>
                  Level {currentLevel}, Quiz {currentQuizIndex + 1}
                </Text>
                <View style={{ height: 12 }} />
                <ButtonShort
                  title="Save Progress"
                  onPress={() => syncToCloud()}
                  style={styles.btn}
                />
                <View style={{ height: 8 }} />
                <ButtonShort
                  title="Load Progress"
                  onPress={async () => {
                    await loadFromCloud();
                    setShowModal(false);
                  }}
                  style={styles.btn}
                />
                <View style={{ height: 8 }} />
                <Pressable
                  accessibilityRole="button"
                  onPress={async () => {
                    await signOut();
                    setShowModal(false);
                  }}
                  style={styles.signOutBtn}
                >
                  <Text style={styles.signOutText}>Sign Out</Text>
                </Pressable>
              </>
            ) : (
              <>
                <Ionicons name="cloud-outline" size={48} color="#B884FF" />
                <Text style={styles.title}>Cloud Backup</Text>
                <Text style={styles.body}>
                  Optionally sign in with Google to save your preparation progress to the cloud. This is not required to use the app.
                </Text>
                <View style={{ height: 16 }} />
                {Platform.OS === 'web' ? (
                  <>
                    <Pressable
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: isHumanChecked }}
                      accessibilityLabel="I am not a robot check"
                      aria-label="I am not a robot check"
                      onPress={() => setIsHumanChecked((v) => !v)}
                      style={styles.checkboxRow}
                    >
                      <Ionicons
                        name={isHumanChecked ? 'checkbox-outline' : 'square-outline'}
                        size={22}
                        color={isHumanChecked ? '#2db200' : '#7A7A7A'}
                        accessibilityRole="image"
                        accessibilityLabel="Captcha checkbox icon"
                        aria-label="Captcha checkbox icon"
                      />
                      <Text style={styles.checkboxText}>I'm not a robot</Text>
                    </Pressable>
                    <View style={{ height: 10 }} />
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Sign in with Google"
                      aria-label="Sign in with Google"
                      onPress={async () => {
                        if (!isHumanChecked) return;
                        const result = await signInWithGoogle();
                        if (result) setShowModal(false);
                      }}
                      style={[
                        styles.signInBtn,
                        isHumanChecked ? styles.signInBtnEnabled : styles.signInBtnDisabled,
                      ]}
                    >
                      <Text style={styles.signInBtnText}>Sign in with Google</Text>
                    </Pressable>
                  </>
                ) : (
                  <Text style={styles.meta}>
                    Google sign-in is available on web only for now.
                  </Text>
                )}
              </>
            )}
            <View style={{ height: 12 }} />
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setIsHumanChecked(false);
                setShowModal(false);
              }}
              style={styles.closeBtn}
            >
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  iconHit: { padding: 6 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E7E4E7',
  },
  greeting: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '800',
    color: '#4B4B4B',
    textAlign: 'center',
    fontFamily: 'Acme_400Regular',
  },
  title: {
    marginTop: 8,
    fontSize: 20,
    fontWeight: '900',
    color: '#4B4B4B',
    fontFamily: 'Acme_400Regular',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#2db200',
    fontWeight: '700',
  },
  body: {
    marginTop: 8,
    fontSize: 14,
    color: '#7A7A7A',
    textAlign: 'center',
    lineHeight: 20,
  },
  meta: {
    marginTop: 4,
    fontSize: 12,
    color: '#7A7A7A',
  },
  checkboxRow: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  checkboxText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#4B4B4B',
    fontWeight: '700',
  },
  signInBtn: {
    width: '80%',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  signInBtnEnabled: {
    backgroundColor: '#2db200',
  },
  signInBtnDisabled: {
    backgroundColor: '#A7C9A1',
  },
  signInBtnText: {
    color: '#fff',
    fontWeight: '800',
    letterSpacing: 0.5,
    fontSize: 16,
    fontFamily: 'Acme_400Regular',
  },
  btn: { width: '80%' },
  signOutBtn: {
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  signOutText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FF2D2D',
  },
  closeBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  closeText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#7A7A7A',
  },
});
