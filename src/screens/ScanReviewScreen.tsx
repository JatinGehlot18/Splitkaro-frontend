import React, { useState } from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';
import { expensesApi } from '../api/endpoints';
import { ReceiptScan } from '../api/types';
import { useAuth } from '../auth/AuthContext';
import { AppText, Screen } from '../components/primitives';
import { useNavigation, useRoute } from '../nav/navigation';
import { useTheme } from '../theme/ThemeContext';
import { rupees } from '../util/format';

export default function ScanReviewScreen() {
  const { theme } = useTheme();
  const nav = useNavigation();
  const { token, user } = useAuth();
  const { params } = useRoute<{ id: string; scan: ReceiptScan }>();
  const scan = params.scan;
  const [saving, setSaving] = useState(false);

  async function use() {
    if (!user) return;
    try {
      setSaving(true);
      await expensesApi.create(
        {
          groupId: params.id,
          description: scan.merchant,
          amount: scan.amount,
          splitType: 'EQUAL',
          participants: [{ userId: user.id }],
        },
        token ?? undefined,
      );
      Alert.alert('Added', 'Expense created from the receipt.', [
        { text: 'OK', onPress: () => nav.reset('Groups') },
      ]);
    } catch (e) {
      Alert.alert('Could not save', e instanceof Error ? e.message : 'Check that the API is running.');
    } finally {
      setSaving(false);
    }
  }

  const cell = { backgroundColor: theme.surface, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14 } as const;
  const capLabel = { textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 4 } as const;

  return (
    <Screen padded scroll>
      <View style={{ marginTop: 20 }}>
        <AppText size={16} weight="800">
          We found these details
        </AppText>
        <AppText size={13} weight="600" color={theme.textDim} style={{ marginTop: 4, marginBottom: 20 }}>
          Review before adding to {scan.targetGroup}
        </AppText>
      </View>

      <View
        style={{ width: '100%', height: 120, borderRadius: 16, borderWidth: 1, borderColor: theme.border, backgroundColor: theme.surface, alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
        <AppText size={11} weight="700" color={theme.textFaint}>
          scanned receipt
        </AppText>
      </View>

      <View style={[cell, { marginBottom: 10 }]}>
        <AppText size={10} weight="700" color={theme.textFaint} style={capLabel}>
          Merchant
        </AppText>
        <AppText size={14} weight="700">
          {scan.merchant}
        </AppText>
      </View>

      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
        <View style={[cell, { flex: 1 }]}>
          <AppText size={10} weight="700" color={theme.textFaint} style={capLabel}>
            Amount
          </AppText>
          <AppText size={15} weight="800">
            {rupees(scan.amount)}
          </AppText>
        </View>
        <View style={[cell, { flex: 1 }]}>
          <AppText size={10} weight="700" color={theme.textFaint} style={capLabel}>
            Category
          </AppText>
          <AppText size={15} weight="800">
            {scan.category}
          </AppText>
        </View>
      </View>

      <View style={[cell, { marginBottom: 22 }]}>
        <AppText size={10} weight="700" color={theme.textFaint} style={capLabel}>
          Date
        </AppText>
        <AppText size={14} weight="700">
          {scan.date}
        </AppText>
      </View>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <TouchableOpacity
          onPress={() => nav.replace('ScanReceipt', { id: params.id })}
          style={{ flex: 1, backgroundColor: theme.surface, borderRadius: 14, paddingVertical: 15, alignItems: 'center' }}>
          <AppText size={13} weight="800">
            Retake
          </AppText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={use}
          disabled={saving}
          style={{ flex: 2, backgroundColor: theme.teal, borderRadius: 14, paddingVertical: 15, alignItems: 'center' }}>
          <AppText size={13} weight="800" color={theme.onAccent}>
            {saving ? 'Saving…' : 'Use this expense'}
          </AppText>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}
