import React, { useState } from 'react';
import { Alert, TextInput, TouchableOpacity, View } from 'react-native';
import { authApi, profileApi, toUser } from '../api/endpoints';
import { useAuth } from '../auth/AuthContext';
import { AppText, Field, PrimaryButton, Screen } from '../components/primitives';
import { useNavigation } from '../nav/navigation';
import { useTheme } from '../theme/ThemeContext';

export default function LoginScreen() {
  const { theme, toggle, isDark } = useTheme();
  const { setAuth } = useAuth();
  const nav = useNavigation();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function afterAuth(res: { accessToken: string; refreshToken: string }) {
    const summary = await profileApi.me(res.accessToken);
    setAuth(res.accessToken, res.refreshToken, toUser(summary));
    nav.reset('Groups');
  }

  async function submit() {
    if (!email.trim() || !password) {
      Alert.alert('Missing details', 'Enter your email and password.');
      return;
    }
    if (mode === 'signup' && !displayName.trim()) {
      Alert.alert('Missing details', 'Enter your name.');
      return;
    }
    try {
      setLoading(true);
      const res =
        mode === 'signin'
          ? await authApi.login(email.trim(), password)
          : await authApi.register(email.trim(), password, displayName.trim());
      await afterAuth(res);
    } catch (e) {
      Alert.alert(
        mode === 'signin' ? 'Sign-in failed' : 'Sign-up failed',
        e instanceof Error ? e.message : 'Could not reach the API.',
      );
    } finally {
      setLoading(false);
    }
  }

  function googleSignIn() {
    Alert.alert(
      'Google sign-in',
      'Native Google Sign-In isn’t wired up yet — it needs an idToken from the Google SDK.',
    );
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

      <View style={{ flexDirection: 'row', backgroundColor: theme.surface, borderRadius: 14, padding: 4, marginTop: 36 }}>
        {(['signin', 'signup'] as const).map(m => (
          <TouchableOpacity
            key={m}
            onPress={() => setMode(m)}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: 10,
              alignItems: 'center',
              backgroundColor: mode === m ? theme.teal : 'transparent',
            }}>
            <AppText size={13} weight="800" color={mode === m ? theme.onAccent : theme.textDim}>
              {m === 'signin' ? 'Sign in' : 'Create account'}
            </AppText>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ gap: 14, marginTop: 20 }}>
        {mode === 'signup' ? (
          <Field label="Your name">
            <TextInput
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Rohan Mehta"
              placeholderTextColor={theme.textFaint}
              style={{ fontWeight: '700', fontSize: 14, color: theme.text }}
            />
          </Field>
        ) : null}

        <Field label="Email">
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor={theme.textFaint}
            autoCapitalize="none"
            keyboardType="email-address"
            style={{ fontWeight: '700', fontSize: 14, color: theme.text }}
          />
        </Field>

        <Field label="Password">
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor={theme.textFaint}
            secureTextEntry
            style={{ fontWeight: '700', fontSize: 14, color: theme.text }}
          />
        </Field>

        <View style={{ marginTop: 6 }}>
          <PrimaryButton
            label={mode === 'signin' ? 'Sign in' : 'Create account'}
            onPress={submit}
            loading={loading}
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={googleSignIn}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            backgroundColor: theme.surface,
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: 16,
            paddingVertical: 15,
          }}>
          <AppText size={15} weight="800" color={theme.text}>
            G
          </AppText>
          <AppText size={14} weight="700">
            Continue with Google
          </AppText>
        </TouchableOpacity>

        <AppText size={11} weight="600" color={theme.textFaint} style={{ textAlign: 'center', marginTop: 8, lineHeight: 18 }}>
          By continuing you agree to the Terms & Privacy Policy
        </AppText>
      </View>
    </Screen>
  );
}
