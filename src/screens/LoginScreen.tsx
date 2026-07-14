import React, { useState } from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';
import { authApi } from '../api/endpoints';
import { useAuth } from '../auth/AuthContext';
import { AppText, Screen } from '../components/primitives';
import { useNavigation } from '../nav/navigation';
import { useTheme } from '../theme/ThemeContext';

const METHODS = [
  { id: 'google', label: 'Continue with Google', icon: 'G' },
  { id: 'phone', label: 'Continue with phone number', icon: '☎' },
  { id: 'email', label: 'Continue with email', icon: '✉' },
];

export default function LoginScreen() {
  const { theme, toggle, isDark } = useTheme();
  const { setAuth } = useAuth();
  const nav = useNavigation();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function signIn(method: string) {
    try {
      setLoadingId(method);
      const res = await authApi.login(method);
      setAuth(res.token, res.user);
      if (res.needsProfile) nav.replace('ProfileSetup');
      else nav.reset('Groups');
    } catch (e) {
      Alert.alert('Sign-in failed', 'Could not reach the API. Is the mock server running?');
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <Screen padded scroll contentStyle={{ minHeight: '100%' }}>
      <View style={{ flex: 1, justifyContent: 'flex-start', paddingTop: 34 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 18,
              backgroundColor: theme.tealBg,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <AppText size={24} weight="900" color={theme.teal}>
              ₹
            </AppText>
          </View>
          <TouchableOpacity
            onPress={toggle}
            style={{
              borderWidth: 1,
              borderColor: theme.border,
              borderRadius: 12,
              paddingHorizontal: 14,
              paddingVertical: 8,
            }}>
            <AppText size={12} weight="700" color={theme.textDim}>
              {isDark ? '☀ Light' : '☾ Dark'}
            </AppText>
          </TouchableOpacity>
        </View>

        <AppText size={26} weight="900" style={{ marginTop: 28, lineHeight: 34 }}>
          Split bills,{'\n'}not friendships
        </AppText>
        <AppText size={14} weight="600" color={theme.textDim} style={{ marginTop: 10, lineHeight: 21 }}>
          Track shared expenses with your flatmates and friends
        </AppText>
      </View>

      <View style={{ gap: 12, marginTop: 40 }}>
        {METHODS.map(m => (
          <TouchableOpacity
            key={m.id}
            activeOpacity={0.85}
            onPress={() => signIn(m.id)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              backgroundColor: theme.surface,
              borderWidth: 1,
              borderColor: theme.border,
              borderRadius: 16,
              paddingHorizontal: 18,
              paddingVertical: 15,
              opacity: loadingId && loadingId !== m.id ? 0.5 : 1,
            }}>
            <AppText size={15} weight="800" color={theme.text} style={{ width: 20 }}>
              {m.icon}
            </AppText>
            <AppText size={14} weight="700">
              {loadingId === m.id ? 'Signing in…' : m.label}
            </AppText>
          </TouchableOpacity>
        ))}
        <AppText size={11} weight="600" color={theme.textFaint} style={{ textAlign: 'center', marginTop: 8, lineHeight: 18 }}>
          By continuing you agree to the Terms & Privacy Policy
        </AppText>
      </View>
    </Screen>
  );
}
