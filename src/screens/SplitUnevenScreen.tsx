import React, { useMemo, useState } from 'react';
import { Alert, TextInput, View } from 'react-native';
import { expensesApi, referenceApi } from '../api/endpoints';
import { Member } from '../api/types';
import { AppText, Avatar, Header, Loading, PrimaryButton, Screen } from '../components/primitives';
import { useNavigation, useRoute } from '../nav/navigation';
import { useTheme } from '../theme/ThemeContext';
import { rupees } from '../util/format';
import { useApi } from '../util/useApi';

const DEFAULTS: Record<string, string> = { rohan: '800', ananya: '700', vikram: '500', priya: '450' };

export default function SplitUnevenScreen() {
  const { theme } = useTheme();
  const nav = useNavigation();
  const { params } = useRoute<{ id: string; description?: string; amount?: string }>();
  const total = Number(params.amount) || 2450;
  const description = params.description ?? 'BigBasket groceries';

  const { data: members, loading } = useApi<Member[]>(() => referenceApi.members(), []);
  const [amounts, setAmounts] = useState<Record<string, string>>(DEFAULTS);
  const [saving, setSaving] = useState(false);

  const assigned = useMemo(
    () => Object.values(amounts).reduce((sum, v) => sum + (Number(v) || 0), 0),
    [amounts],
  );
  const remaining = total - assigned;

  async function save() {
    if (remaining !== 0) {
      Alert.alert('Amounts don’t add up', `Remaining to assign: ${rupees(remaining)}`);
      return;
    }
    try {
      setSaving(true);
      await expensesApi.create({
        groupId: params.id,
        description,
        amount: total,
        splitType: 'unequal',
        shares: amounts,
      });
      Alert.alert('Saved', 'Split saved.', [{ text: 'OK', onPress: () => nav.reset('Groups') }]);
    } catch {
      Alert.alert('Could not save', 'Check that the mock API is running.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen padded scroll>
      <View style={{ marginTop: 8 }}>
        <Header title="Split unevenly" onBack={nav.goBack} />
      </View>

      <View style={{ backgroundColor: theme.surface, borderRadius: 16, padding: 16, marginBottom: 20 }}>
        <AppText size={13} weight="700">
          {description}
        </AppText>
        <AppText size={20} weight="800" style={{ marginTop: 4 }}>
          {rupees(total)}
        </AppText>
      </View>

      {loading ? <Loading /> : null}
      {(members ?? []).map(m => (
        <View
          key={m.id}
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: theme.border }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Avatar initials={m.initials} bg={m.avatarBg} size={32} textSize={11} />
            <AppText size={13} weight="700">
              {m.name}
            </AppText>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: theme.surface, borderRadius: 10, borderWidth: 1, borderColor: theme.border, paddingHorizontal: 12 }}>
            <AppText size={13} weight="800" color={theme.textDim}>
              ₹
            </AppText>
            <TextInput
              value={amounts[m.id] ?? ''}
              onChangeText={t => setAmounts(a => ({ ...a, [m.id]: t.replace(/[^0-9]/g, '') }))}
              keyboardType="number-pad"
              placeholder="0"
              placeholderTextColor={theme.textFaint}
              style={{ fontWeight: '800', fontSize: 13, color: theme.text, minWidth: 54, textAlign: 'right', paddingVertical: 8 }}
            />
          </View>
        </View>
      ))}

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 18, marginBottom: 24 }}>
        <AppText size={12} weight="700" color={theme.textFaint}>
          Remaining to assign
        </AppText>
        <AppText size={13} weight="800" color={remaining === 0 ? theme.teal : theme.coral}>
          {rupees(remaining)}
        </AppText>
      </View>

      <PrimaryButton label="Save split" onPress={save} loading={saving} />
    </Screen>
  );
}
