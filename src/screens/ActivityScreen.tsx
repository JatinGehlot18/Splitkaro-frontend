import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { notificationsApi } from '../api/endpoints';
import { ActivityItem } from '../api/types';
import { useAuth } from '../auth/AuthContext';
import { AppText, ErrorState, Loading, Screen } from '../components/primitives';
import { useTheme } from '../theme/ThemeContext';
import { useApi } from '../util/useApi';

export default function ActivityScreen() {
  const { theme } = useTheme();
  const { user, token } = useAuth();
  const userId = user?.id ?? '';

  const { data, loading, error, reload } = useApi<ActivityItem[]>(
    () => notificationsApi.list(userId, token ?? undefined),
    [userId, token],
  );

  const hasUnread = (data ?? []).some(n => !n.read);

  async function markRead(item: ActivityItem) {
    if (item.read) return;
    try {
      await notificationsApi.markRead(userId, item.id, token ?? undefined);
      reload();
    } catch {
      // non-critical — leave as unread on failure
    }
  }

  async function markAllRead() {
    try {
      await notificationsApi.markAllRead(userId, token ?? undefined);
      reload();
    } catch {
      // non-critical
    }
  }

  return (
    <Screen padded scroll>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, marginBottom: 22 }}>
        <AppText size={22} weight="800">
          Activity
        </AppText>
        {hasUnread ? (
          <TouchableOpacity onPress={markAllRead}>
            <AppText size={12} weight="800" color={theme.teal}>
              Mark all read
            </AppText>
          </TouchableOpacity>
        ) : null}
      </View>

      {loading ? <Loading /> : null}
      {error ? <ErrorState message={error} onRetry={reload} /> : null}

      {data && data.length === 0 ? (
        <AppText size={13} weight="600" color={theme.textFaint} style={{ textAlign: 'center', paddingVertical: 40 }}>
          Nothing here yet.
        </AppText>
      ) : null}

      {(data ?? []).map(item => (
        <TouchableOpacity
          key={item.id}
          activeOpacity={0.7}
          onPress={() => markRead(item)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            paddingVertical: 13,
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
          }}>
          <AppText size={18}>{item.icon}</AppText>
          <View style={{ flex: 1 }}>
            <AppText size={13} weight={item.read ? '600' : '800'} color={item.read ? theme.textDim : theme.text}>
              {item.message}
            </AppText>
            <AppText size={11} weight="600" color={theme.textFaint} style={{ marginTop: 2 }}>
              {item.when}
            </AppText>
          </View>
          {!item.read ? (
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: theme.teal }} />
          ) : null}
        </TouchableOpacity>
      ))}
    </Screen>
  );
}
