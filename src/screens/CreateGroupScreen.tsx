import React, { useState } from 'react';
import { Alert, TextInput, TouchableOpacity, View } from 'react-native';
import { groupsApi } from '../api/endpoints';
import { useAuth } from '../auth/AuthContext';
import { AppText, Avatar, Header, PrimaryButton, Screen, SectionLabel } from '../components/primitives';
import { useNavigation } from '../nav/navigation';
import { useTheme } from '../theme/ThemeContext';

const SWATCHES = ['#7FD8C8', '#F0A58F', '#D8C98A', '#C3AEDD', '#A7C0E8'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function CreateGroupScreen() {
  const { theme } = useTheme();
  const nav = useNavigation();
  const { token } = useAuth();
  const [name, setName] = useState('');
  const [colorIdx, setColorIdx] = useState(0);
  const [invited, setInvited] = useState<string[]>([]);
  const [inviteInput, setInviteInput] = useState('');
  const [saving, setSaving] = useState(false);

  const initials =
    name
      .split(' ')
      .map(w => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'GR';

  function addInvite() {
    const email = inviteInput.trim().toLowerCase();
    if (!EMAIL_RE.test(email)) {
      Alert.alert('Enter a valid email', 'e.g. flatmate@example.com');
      return;
    }
    if (!invited.includes(email)) setInvited(list => [...list, email]);
    setInviteInput('');
  }

  async function create() {
    if (!name.trim()) {
      Alert.alert('Name your group', 'Give the group a name first.');
      return;
    }
    try {
      setSaving(true);
      const { failedInvites } = await groupsApi.create(
        { name: name.trim(), color: SWATCHES[colorIdx], invitedEmails: invited },
        token ?? undefined,
      );
      if (failedInvites.length) {
        Alert.alert('Some invites failed', `Could not add: ${failedInvites.join(', ')}`);
      }
      nav.reset('Groups');
    } catch (e) {
      Alert.alert('Could not create group', e instanceof Error ? e.message : 'Check that the API is running.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen padded scroll>
      <View style={{ marginTop: 8 }}>
        <Header title="New group" onBack={nav.goBack} />
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 22 }}>
        <Avatar initials={initials} bg={SWATCHES[colorIdx]} size={56} radius={18} textSize={18} />
        <View style={{ flex: 1, backgroundColor: theme.surface, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 4 }}>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Group name"
            placeholderTextColor={theme.textFaint}
            style={{ fontWeight: '700', fontSize: 14, color: theme.text, paddingVertical: 12 }}
          />
        </View>
      </View>

      <SectionLabel>Group color</SectionLabel>
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 24 }}>
        {SWATCHES.map((c, i) => (
          <TouchableOpacity
            key={c + i}
            onPress={() => setColorIdx(i)}
            style={{
              width: 34,
              height: 34,
              borderRadius: 11,
              backgroundColor: c,
              borderWidth: i === colorIdx ? 2 : 0,
              borderColor: theme.teal,
            }}
          />
        ))}
      </View>

      <SectionLabel>Add flatmates</SectionLabel>
      <View style={{ backgroundColor: theme.surface, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 4, marginBottom: 14 }}>
        <TextInput
          value={inviteInput}
          onChangeText={setInviteInput}
          onSubmitEditing={addInvite}
          returnKeyType="done"
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="flatmate@example.com"
          placeholderTextColor={theme.textFaint}
          style={{ fontWeight: '600', fontSize: 14, color: theme.text, paddingVertical: 12 }}
        />
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 22 }}>
        {invited.map(n => (
          <TouchableOpacity
            key={n}
            onPress={() => setInvited(list => list.filter(x => x !== n))}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: theme.tealBg, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7 }}>
            <AppText size={12} weight="700" color={theme.tealText}>
              {n}
            </AppText>
            <AppText size={12} weight="700" color={theme.tealText}>
              ✕
            </AppText>
          </TouchableOpacity>
        ))}
      </View>

      <SectionLabel>Or share an invite link</SectionLabel>
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 26 }}>
        {['Copy link', 'WhatsApp'].map(l => (
          <View key={l} style={{ flex: 1, backgroundColor: theme.surface, borderRadius: 12, paddingVertical: 12, alignItems: 'center' }}>
            <AppText size={12} weight="800">
              {l}
            </AppText>
          </View>
        ))}
      </View>

      <PrimaryButton label="Create group" onPress={create} loading={saving} />
    </Screen>
  );
}
