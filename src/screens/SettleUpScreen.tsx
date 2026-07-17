import React, { useMemo, useState } from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';
import { groupsApi, settlementsApi } from '../api/endpoints';
import { GroupDetail } from '../api/types';
import { useAuth } from '../auth/AuthContext';
import { AppText, Avatar, ErrorState, Header, Loading, PrimaryButton, Screen, SectionLabel } from '../components/primitives';
import { useNavigation, useRoute } from '../nav/navigation';
import { useTheme } from '../theme/ThemeContext';
import { rupees } from '../util/format';
import { useApi } from '../util/useApi';

export default function SettleUpScreen() {
  const { theme } = useTheme();
  const nav = useNavigation();
  const { token, user } = useAuth();
  const { params } = useRoute<{ id: string }>();
  const groupId = params.id;
  const { data, loading, error, reload } = useApi<GroupDetail>(
    () => groupsApi.detail(groupId, user!.id, token ?? undefined),
    [groupId, token, user?.id],
  );
  const [selected, setSelected] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const rows = useMemo(() => data?.balances.rows ?? [], [data]);
  const active = useMemo(
    () => rows.find(r => r.id === (selected ?? rows[0]?.id)),
    [rows, selected],
  );

  async function record() {
    if (!active) return;
    if (active.direction === 'owed') {
      Alert.alert('Not supported yet', `${active.label} needs to record this payment from their own account.`);
      return;
    }
    try {
      setSaving(true);
      await settlementsApi.record({ groupId, receiverId: active.id, amount: active.amount }, token ?? undefined);
      Alert.alert('Payment recorded', `Settled ${rupees(active.amount)} with ${active.label}.`, [
        { text: 'OK', onPress: () => nav.goBack() },
      ]);
    } catch (e) {
      Alert.alert('Could not record', e instanceof Error ? e.message : 'Check that the API is running.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen padded scroll>
      <View style={{ marginTop: 8 }}>
        <Header title="Record a payment" onBack={nav.goBack} />
      </View>

      {loading ? <Loading /> : null}
      {error ? <ErrorState message={error} onRetry={reload} /> : null}

      {data ? (
        <>
          <SectionLabel>Who</SectionLabel>
          {rows.map(r => {
            const isSel = r.id === (selected ?? rows[0]?.id);
            return (
              <TouchableOpacity
                key={r.id}
                onPress={() => setSelected(r.id)}
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: isSel ? theme.tealBg : theme.surface, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 13, marginBottom: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Avatar initials={r.initials} bg={r.avatarBg} size={32} textSize={12} />
                  <AppText size={13} weight="700">
                    {r.label}
                  </AppText>
                </View>
                <AppText size={13} weight="800" color={r.direction === 'owed' ? theme.teal : theme.coral}>
                  {rupees(r.amount)}
                </AppText>
              </TouchableOpacity>
            );
          })}

          <View style={{ marginTop: 8 }}>
            <SectionLabel>Amount</SectionLabel>
          </View>
          <View style={{ backgroundColor: theme.surface, borderRadius: 14, padding: 16, marginBottom: 24 }}>
            <AppText size={22} weight="900">
              {active ? rupees(active.amount) : '₹0'}
            </AppText>
          </View>

          <PrimaryButton label="Record payment" onPress={record} loading={saving} />
        </>
      ) : null}
    </Screen>
  );
}
