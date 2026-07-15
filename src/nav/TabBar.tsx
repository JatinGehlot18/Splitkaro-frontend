import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../auth/AuthContext';
import { AppText, Avatar } from '../components/primitives';
import { useTheme } from '../theme/ThemeContext';
import { RouteName, TAB_ROUTES, useNavigation, useRoute } from './navigation';

const TABS: { route: RouteName; label: string; icon?: string }[] = [
  { route: 'Groups', label: 'Groups', icon: '👥' },
  { route: 'Friends', label: 'Friends', icon: '🤝' },
  { route: 'Activity', label: 'Activity', icon: '🔔' },
  { route: 'Account', label: 'Account' },
];

/** Persistent bottom tab bar, shown only on the four top-level sections. */
export function TabBar() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const nav = useNavigation();
  const { name } = useRoute();
  const { user } = useAuth();

  if (!TAB_ROUTES.includes(name)) return null;

  return (
    <View
      style={{
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: theme.border,
        backgroundColor: theme.surface,
        paddingTop: 10,
        paddingBottom: insets.bottom + 10,
      }}>
      {TABS.map(tab => {
        const active = tab.route === name;
        const color = active ? theme.teal : theme.textFaint;
        return (
          <TouchableOpacity
            key={tab.route}
            activeOpacity={0.7}
            onPress={() => nav.reset(tab.route)}
            style={{ flex: 1, alignItems: 'center', gap: 4 }}>
            {tab.route === 'Account' && user ? (
              <Avatar
                initials={user.initials}
                bg={user.avatarBg}
                size={22}
                textSize={10}
                ring={active ? theme.teal : undefined}
              />
            ) : (
              <AppText size={17}>{tab.icon}</AppText>
            )}
            <AppText size={10} weight="700" color={color}>
              {tab.label}
            </AppText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
