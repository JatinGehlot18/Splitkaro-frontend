import React, { useEffect, useState } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { groupsApi } from '../api/endpoints';
import { Expense } from '../api/types';
import { AppText, Avatar, Header, Loading, Screen } from '../components/primitives';
import { useNavigation, useRoute } from '../nav/navigation';
import { useTheme } from '../theme/ThemeContext';
import { rupees } from '../util/format';

export default function SearchScreen() {
  const { theme } = useTheme();
  const nav = useNavigation();
  const { params } = useRoute<{ id: string }>();
  const groupId = params.id ?? 'hsr';
  const [query, setQuery] = useState('swiggy');
  const [results, setResults] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);

  // Debounced search hitting the API each time the query changes.
  useEffect(() => {
    let alive = true;
    setLoading(true);
    const t = setTimeout(() => {
      groupsApi
        .search(groupId, query)
        .then(r => {
          if (alive) setResults(r.results);
        })
        .finally(() => {
          if (alive) setLoading(false);
        });
    }, 220);
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [groupId, query]);

  const noResults = query.trim().length > 0 && !loading && results.length === 0;

  return (
    <Screen padded scroll>
      <View style={{ marginTop: 8 }}>
        <Header title="Search" onBack={nav.goBack} />
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: theme.surface, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 4, marginBottom: 18 }}>
        <AppText size={14} weight="700" color={theme.textDim}>
          🔍
        </AppText>
        <TextInput
          value={query}
          onChangeText={setQuery}
          autoFocus
          placeholder="Search expenses"
          placeholderTextColor={theme.textFaint}
          style={{ flex: 1, fontWeight: '700', fontSize: 14, color: theme.text, paddingVertical: 13 }}
        />
      </View>

      {loading ? <Loading /> : null}

      {results.map(r => (
        <TouchableOpacity
          key={r.id}
          activeOpacity={0.85}
          onPress={() => nav.push('ExpenseDetail', { groupId, expenseId: r.id })}
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.border }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
            <Avatar initials={r.icon} bg={r.tint} size={36} radius={12} textSize={12} />
            <View style={{ flex: 1 }}>
              <AppText size={13} weight="800" numberOfLines={1}>
                {r.title}
              </AppText>
              <AppText size={11} weight="700" color={theme.textFaint} style={{ marginTop: 2 }}>
                {r.category} · paid by {r.paidByName}
              </AppText>
            </View>
          </View>
          <AppText size={13} weight="900">
            {rupees(r.amount)}
          </AppText>
        </TouchableOpacity>
      ))}

      {noResults ? (
        <View style={{ paddingVertical: 40, alignItems: 'center' }}>
          <AppText size={13} weight="700" color={theme.textFaint}>
            No expenses match "{query}"
          </AppText>
        </View>
      ) : null}
    </Screen>
  );
}
