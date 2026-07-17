import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../auth/AuthContext';
import { AppText, Avatar } from '../components/primitives';
import { useTheme } from '../theme/ThemeContext';
import { TabParamList } from './navigation';

const TABS: { route: keyof TabParamList; label: string; icon?: string }[] = [
  { route: 'Groups', label: 'Groups', icon: '👥' },
  { route: 'Friends', label: 'Friends', icon: '🤝' },
  { route: 'Activity', label: 'Activity', icon: '🔔' },
  { route: 'Account', label: 'Account' },
];

/** Persistent bottom tab bar, rendered by the Tab.Navigator's tabBar prop. */
export function TabBar({ state, navigation }: BottomTabBarProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const activeName = state.routeNames[state.index];

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
        const active = tab.route === activeName;
        const color = active ? theme.teal : theme.textFaint;
        return (
          <TouchableOpacity
            key={tab.route}
            activeOpacity={0.7}
            onPress={() => navigation.navigate(tab.route)}
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
