import React from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';
import { friendsApi } from '../api/endpoints';
import { FriendRequest, PersonBalance } from '../api/types';
import { useAuth } from '../auth/AuthContext';
import { AppText, Avatar, ErrorState, Loading, Screen, SectionLabel } from '../components/primitives';
import { useTheme } from '../theme/ThemeContext';
import { rupees } from '../util/format';
import { useApi } from '../util/useApi';

export default function FriendsScreen() {
  const { theme } = useTheme();
  const { user, token } = useAuth();
  const userId = user?.id ?? '';

  const { data, loading, error, reload } = useApi<{ requests: FriendRequest[]; balances: PersonBalance[] }>(
    () =>
      Promise.all([
        friendsApi.pendingRequests(userId, token ?? undefined),
        friendsApi.balances(token ?? undefined),
      ]).then(([requests, balances]) => ({ requests, balances })),
    [userId, token],
  );

  async function accept(friendshipId: string) {
    try {
      await friendsApi.accept(userId, friendshipId, token ?? undefined);
      reload();
    } catch (e) {
      Alert.alert('Could not accept', e instanceof Error ? e.message : 'Something went wrong.');
    }
  }

  async function remove(friendshipId: string) {
    try {
      await friendsApi.remove(userId, friendshipId, token ?? undefined);
      reload();
    } catch (e) {
      Alert.alert('Could not remove', e instanceof Error ? e.message : 'Something went wrong.');
    }
  }

  const incoming = data?.requests.filter(r => r.incoming) ?? [];
  const outgoing = data?.requests.filter(r => !r.incoming) ?? [];

  return (
    <Screen padded scroll>
      <View style={{ marginTop: 8, marginBottom: 22 }}>
        <AppText size={22} weight="800">
          Friends
        </AppText>
      </View>

      {loading ? <Loading /> : null}
      {error ? <ErrorState message={error} onRetry={reload} /> : null}

      {incoming.length ? (
        <View style={{ marginBottom: 22 }}>
          <SectionLabel>Requests</SectionLabel>
          {incoming.map(r => (
            <View
              key={r.friendshipId}
              style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: theme.border }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Avatar initials={r.person.initials} bg={r.person.avatarBg} size={34} textSize={12} />
                <AppText size={13} weight="700">
                  {r.person.name}
                </AppText>
              </View>
              <View style={{ flexDirection: 'row', gap: 14 }}>
                <TouchableOpacity onPress={() => accept(r.friendshipId)}>
                  <AppText size={13} weight="800" color={theme.teal}>
                    Accept
                  </AppText>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => remove(r.friendshipId)}>
                  <AppText size={13} weight="800" color={theme.textFaint}>
                    Decline
                  </AppText>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      ) : null}

      {outgoing.length ? (
        <View style={{ marginBottom: 22 }}>
          <SectionLabel>Pending</SectionLabel>
          {outgoing.map(r => (
            <View
              key={r.friendshipId}
              style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: theme.border }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Avatar initials={r.person.initials} bg={r.person.avatarBg} size={34} textSize={12} />
                <AppText size={13} weight="700">
                  {r.person.name}
                </AppText>
              </View>
              <TouchableOpacity onPress={() => remove(r.friendshipId)}>
                <AppText size={12} weight="700" color={theme.textFaint}>
                  Cancel
                </AppText>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ) : null}

      {data ? (
        <View>
          <SectionLabel>Balances</SectionLabel>
          {data.balances.length === 0 ? (
            <AppText size={13} weight="600" color={theme.textFaint} style={{ paddingVertical: 20, textAlign: 'center' }}>
              You're all settled up.
            </AppText>
          ) : (
            data.balances.map(({ person, amount }) => (
              <View
                key={person.id}
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: theme.border }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Avatar initials={person.initials} bg={person.avatarBg} size={34} textSize={12} />
                  <AppText size={13} weight="700">
                    {person.name}
                  </AppText>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <AppText size={11} weight="600" color={theme.textFaint}>
                    {amount > 0 ? 'owes you' : 'you owe'}
                  </AppText>
                  <AppText size={13} weight="800" color={amount > 0 ? theme.teal : theme.coral}>
                    {rupees(Math.abs(amount))}
                  </AppText>
                </View>
              </View>
            ))
          )}
        </View>
      ) : null}
    </Screen>
  );
}
