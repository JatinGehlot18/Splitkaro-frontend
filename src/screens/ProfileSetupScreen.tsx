import React, { useState } from 'react';
import { Alert, TextInput, View } from 'react-native';
import { authApi } from '../api/endpoints';
import { useAuth } from '../auth/AuthContext';
import { AppText, PrimaryButton, Screen } from '../components/primitives';
import { useNavigation } from '../nav/navigation';
import { useTheme } from '../theme/ThemeContext';

export default function ProfileSetupScreen() {
  const { theme } = useTheme();
  const { token, user, setAuth } = useAuth();
  const nav = useNavigation();
  const [name, setName] = useState(user?.name ?? 'Rohan Mehta');
  const [phone, setPhone] = useState(user?.phone ?? '+91 98450 12345');
  const [saving, setSaving] = useState(false);

  async function save() {
    try {
      setSaving(true);
      const res = await authApi.saveProfile(name, phone, token ?? undefined);
      setAuth(res.token, res.user);
      nav.reset('Groups');
    } catch (e) {
      Alert.alert('Could not save profile', 'Check that the mock API is running.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen padded scroll contentStyle={{ minHeight: '100%' }}>
      <View style={{ flex: 1, paddingTop: 30 }}>
        <AppText size={22} weight="900">
          Set up your profile
        </AppText>
        <AppText size={13} weight="600" color={theme.textDim} style={{ marginTop: 6 }}>
          This is how flatmates will see you
        </AppText>

        <View style={{ alignItems: 'center', marginVertical: 32 }}>
          <View
            style={{
              width: 92,
              height: 92,
              borderRadius: 26,
              borderWidth: 2,
              borderStyle: 'dashed',
              borderColor: theme.border,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <AppText size={13} weight="700" color={theme.textFaint}>
              + Add photo
            </AppText>
          </View>
        </View>

        <AppText size={12} weight="700" color={theme.textFaint} style={{ marginBottom: 8 }}>
          Your name
        </AppText>
        <View style={{ backgroundColor: theme.surface, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 4, marginBottom: 20 }}>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor={theme.textFaint}
            style={{ fontWeight: '700', fontSize: 14, color: theme.text, paddingVertical: 12 }}
          />
        </View>

        <AppText size={12} weight="700" color={theme.textFaint} style={{ marginBottom: 8 }}>
          Phone number
        </AppText>
        <View style={{ backgroundColor: theme.surface, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 4 }}>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="+91"
            placeholderTextColor={theme.textFaint}
            style={{ fontWeight: '700', fontSize: 14, color: theme.text, paddingVertical: 12 }}
          />
        </View>
      </View>

      <View style={{ marginTop: 24 }}>
        <PrimaryButton label="Continue" onPress={save} loading={saving} />
      </View>
    </Screen>
  );
}
