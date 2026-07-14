import React, { useState } from 'react';
import { Alert, TextInput, TouchableOpacity, View } from 'react-native';
import { groupsApi, referenceApi } from '../api/endpoints';
import { AppText, Avatar, Header, PrimaryButton, Screen, SectionLabel } from '../components/primitives';
import { useNavigation } from '../nav/navigation';
import { useTheme } from '../theme/ThemeContext';
import { useApi } from '../util/useApi';

const INITIAL_INVITED = ['Ananya Iyer', 'Vikram Rao', 'Priya Nair'];

export default function CreateGroupScreen() {
  const { theme } = useTheme();
  const nav = useNavigation();
  const [name, setName] = useState('Indiranagar Cousins');
  const [colorIdx, setColorIdx] = useState(0);
  const [invited, setInvited] = useState<string[]>(INITIAL_INVITED);
  const [saving, setSaving] = useState(false);

  const { data: colors } = useApi<string[]>(() => referenceApi.groupColors(), []);
  const swatches = colors ?? ['#7FD8C8', '#F0A58F', '#D8C98A', '#C3AEDD', '#A7C0E8'];

  const initials =
    name
      .split(' ')
      .map(w => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'GR';

  async function create() {
    try {
      setSaving(true);
      await groupsApi.create({ name, color: swatches[colorIdx], invited });
      nav.reset('Groups');
    } catch {
      Alert.alert('Could not create group', 'Check that the mock API is running.');
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
        <Avatar initials={initials} bg={swatches[colorIdx]} size={56} radius={18} textSize={18} />
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
        {swatches.map((c, i) => (
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
      <View style={{ backgroundColor: theme.surface, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 14 }}>
        <AppText size={14} weight="600" color={theme.textFaint}>
          Search name, phone or email
        </AppText>
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
