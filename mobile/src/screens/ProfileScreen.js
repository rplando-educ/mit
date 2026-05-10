import { StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/AppButton';
import Screen from '../components/Screen';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

export default function ProfileScreen() {
  const { currentUser, userProfile, logout } = useAuth();
  const initials = `${userProfile?.firstName?.[0] || 'R'}${userProfile?.lastName?.[0] || ''}`.toUpperCase();

  return (
    <Screen>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.card}>
        <Text style={styles.avatar}>{initials}</Text>
        <Text style={styles.name}>{userProfile?.fullName || currentUser?.displayName || 'RAMP User'}</Text>
        <Text style={styles.email}>{currentUser?.email}</Text>
        <Text style={styles.role}>{userProfile?.role || 'User'}</Text>
      </View>
      <AppButton title="Logout" variant="secondary" onPress={logout} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: '900',
  },
  card: {
    alignItems: 'center',
    gap: 8,
    marginTop: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 16,
    padding: 22,
    backgroundColor: colors.white,
  },
  avatar: {
    width: 72,
    height: 72,
    overflow: 'hidden',
    borderRadius: 36,
    color: colors.white,
    backgroundColor: colors.brand,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 24,
    fontWeight: '900',
  },
  name: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '900',
  },
  email: {
    color: colors.muted,
  },
  role: {
    marginTop: 4,
    color: colors.brandDark,
    fontWeight: '800',
  },
});
