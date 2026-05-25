import { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/AppButton';
import LocationCard from '../components/LocationCard';
import Screen from '../components/Screen';
import { useAuth } from '../context/AuthContext';
import { subscribeToLocations } from '../services/locationService';
import { colors } from '../theme/colors';

const statusColors = {
  approved: {
    backgroundColor: colors.brandSoft,
    color: colors.brandDark,
  },
  pending: {
    backgroundColor: '#fff7ed',
    color: colors.warning,
  },
  rejected: {
    backgroundColor: '#fef2f2',
    color: colors.danger,
  },
};

export default function ProfileScreen({ navigation }) {
  const { currentUser, userProfile, logout } = useAuth();
  const [locations, setLocations] = useState([]);
  const initials = `${userProfile?.firstName?.[0] || 'R'}${userProfile?.lastName?.[0] || ''}`.toUpperCase();
  const contributedLocations = useMemo(
    () => locations.filter((location) => location.contributorId === currentUser?.uid),
    [locations, currentUser?.uid],
  );

  useEffect(() => subscribeToLocations(setLocations), []);

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

      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>My Contributed Places</Text>
          <Text style={styles.sectionSubtitle}>Locations you submitted for community accessibility mapping.</Text>
        </View>
        <AppButton title="Add" variant="secondary" onPress={() => navigation.navigate('AddLocation')} />
      </View>

      {contributedLocations.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No contributions yet</Text>
          <Text style={styles.emptyText}>Add your first accessible place so others can discover it.</Text>
          <View style={styles.emptyAction}>
            <AppButton title="Add Location" onPress={() => navigation.navigate('AddLocation')} />
          </View>
        </View>
      ) : (
        <FlatList
          data={contributedLocations}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const status = item.status || 'pending';
            return (
              <View style={styles.contribution}>
                <View style={styles.contributionMeta}>
                  <Text style={[styles.status, statusColors[status] || statusColors.pending]}>{status}</Text>
                  <Text style={styles.verification}>{item.verified ? 'Community verified' : 'Awaiting verification'}</Text>
                </View>
                <LocationCard location={item} onPress={() => navigation.navigate('LocationDetails', { id: item.id })} />
              </View>
            );
          }}
        />
      )}
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 28,
    marginBottom: 12,
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '900',
  },
  sectionSubtitle: {
    marginTop: 4,
    maxWidth: 230,
    color: colors.muted,
    lineHeight: 20,
  },
  empty: {
    borderWidth: 1,
    borderColor: colors.line,
    borderStyle: 'dashed',
    borderRadius: 14,
    padding: 18,
    backgroundColor: colors.white,
  },
  emptyTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
  },
  emptyText: {
    marginTop: 6,
    color: colors.muted,
    lineHeight: 20,
  },
  emptyAction: {
    marginTop: 14,
  },
  list: {
    gap: 12,
  },
  contribution: {
    gap: 8,
  },
  contributionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  status: {
    overflow: 'hidden',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    textTransform: 'capitalize',
    fontSize: 12,
    fontWeight: '900',
  },
  verification: {
    flex: 1,
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'right',
  },
});
