import React, { useMemo, useState } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { groupsApi } from '../api/endpoints';
import { Group } from '../api/types';
import { AppText, Avatar, ErrorState, Loading, Screen } from '../components/primitives';
import { useNavigation } from '../nav/navigation';
import { useTheme } from '../theme/ThemeContext';
import { rupees } from '../util/format';
import { useApi } from '../util/useApi';

export default function GroupsScreen() {
  const { theme, toggle, isDark } = useTheme();
  const nav = useNavigation();
  const { data, loading, error, reload } = useApi<Group[]>(() => groupsApi.list(), []);
  const [query, setQuery] = useState('');
  const [favOverrides, setFavOverrides] = useState<Record<string, boolean>>({});

  const groups = useMemo(() => {
    const list = data ?? [];
    const q = query.trim().toLowerCase();
    return q ? list.filter(g => g.name.toLowerCase().includes(q)) : list;
  }, [data, query]);

  async function toggleFav(g: Group) {
    setFavOverrides(o => ({ ...o, [g.id]: !(o[g.id] ?? g.favorite) }));
    try {
      await groupsApi.toggleFavorite(g.id);
    } catch {
      // revert on failure
      setFavOverrides(o => ({ ...o, [g.id]: g.favorite }));
    }
  }

  function balanceParts(net: number) {
    if (net > 0) return { label: 'you are owed', display: rupees(net), color: theme.teal };
    if (net < 0) return { label: 'you owe', display: rupees(net).replace('-', ''), color: theme.coral };
    return { label: '', display: 'settled up', color: theme.textFaint };
  }

  return (
    <Screen padded scroll>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22, marginTop: 8 }}>
        <AppText size={22} weight="800">
          Groups
        </AppText>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity
            onPress={toggle}
            style={{ width: 38, height: 38, borderRadius: 12, borderWidth: 1, borderColor: theme.border, alignItems: 'center', justifyContent: 'center' }}>
            <AppText size={15}>{isDark ? '☀' : '☾'}</AppText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => nav.push('CreateGroup')}
            style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: theme.tealBg, alignItems: 'center', justifyContent: 'center' }}>
            <AppText size={18} weight="800" color={theme.teal}>
              +
            </AppText>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ backgroundColor: theme.surface, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 4, marginBottom: 20 }}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search groups"
          placeholderTextColor={theme.textFaint}
          style={{ fontWeight: '600', fontSize: 14, color: theme.text, paddingVertical: 12 }}
        />
      </View>

      {loading ? <Loading /> : null}
      {error ? <ErrorState message={error} onRetry={reload} /> : null}

      {groups.map(g => {
        const fav = favOverrides[g.id] ?? g.favorite;
        const b = balanceParts(g.net);
        return (
          <TouchableOpacity
            key={g.id}
            activeOpacity={0.85}
            onPress={() => nav.push('GroupDetail', { id: g.id, name: g.name })}
            style={{ backgroundColor: theme.surface, borderRadius: 20, padding: 18, marginBottom: 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Avatar initials={g.emoji} bg={g.tint} size={44} radius={14} textSize={15} />
                <View>
                  <AppText size={15} weight="700">
                    {g.name}
                  </AppText>
                  <AppText size={12} weight="600" color={theme.textFaint} style={{ marginTop: 2 }}>
                    {g.memberLabel}
                  </AppText>
                </View>
              </View>
              <TouchableOpacity onPress={() => toggleFav(g)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <AppText size={17} weight="700" color={fav ? theme.teal : theme.starOff}>
                  {fav ? '★' : '☆'}
                </AppText>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
              {b.label ? (
                <AppText size={12} weight="600" color={theme.textFaint}>
                  {b.label}
                </AppText>
              ) : null}
              <AppText size={16} weight="800" color={b.color}>
                {b.display}
              </AppText>
            </View>
          </TouchableOpacity>
        );
      })}
    </Screen>
  );
}
