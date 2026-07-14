import React, { useState } from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { receiptsApi } from '../api/endpoints';
import { AppText } from '../components/primitives';
import { useNavigation, useRoute } from '../nav/navigation';

/** Dark camera-framing screen. Tapping the shutter "scans" via the API. */
export default function ScanReceiptScreen() {
  const nav = useNavigation();
  const insets = useSafeAreaInsets();
  const { params } = useRoute<{ id: string }>();
  const [scanning, setScanning] = useState(false);

  async function capture() {
    try {
      setScanning(true);
      const scan = await receiptsApi.scan();
      nav.replace('ScanReview', { id: params.id, scan });
    } finally {
      setScanning(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#0B0C0E' }}>
      <View style={{ flex: 1, padding: 22, paddingTop: insets.top + 22, paddingBottom: insets.bottom + 22 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <TouchableOpacity onPress={nav.goBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <AppText size={20} weight="700" color="#ECECEE">
              ‹
            </AppText>
          </TouchableOpacity>
          <AppText size={14} weight="800" color="#ECECEE">
            Scan receipt
          </AppText>
          <AppText size={16} color="#ECECEE">
            ⚡
          </AppText>
        </View>

        <View
          style={{
            flex: 1,
            borderWidth: 2,
            borderStyle: 'dashed',
            borderColor: 'rgba(255,255,255,0.3)',
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 18,
          }}>
          <AppText size={12} weight="700" color="rgba(255,255,255,0.55)" style={{ textAlign: 'center', maxWidth: 200, lineHeight: 22 }}>
            {scanning ? 'Reading the receipt…' : 'Align the receipt within the frame'}
          </AppText>
        </View>

        <View style={{ alignItems: 'center', paddingBottom: 10 }}>
          <TouchableOpacity
            onPress={capture}
            disabled={scanning}
            style={{ width: 64, height: 64, borderRadius: 32, borderWidth: 4, borderColor: '#ECECEE', alignItems: 'center', justifyContent: 'center' }}>
            {scanning ? <ActivityIndicator color="#ECECEE" /> : null}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
