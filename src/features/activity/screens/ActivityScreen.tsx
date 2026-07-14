import React, {useMemo, useState} from 'react';
import {Pressable, Text, TextInput, View} from 'react-native';
import type {CompositeScreenProps} from '@react-navigation/native';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Search, ChevronRight} from 'lucide-react-native';
import type {
  AppStackParamList,
  AppTabParamList,
} from '../../../navigation/types';
import {Screen} from '../../../components/ui/Screen';
import {StatusChip} from '../../../components/ui/ListRow';
import {useTheme} from '../../../theme/ThemeProvider';
import {useTransactionsQuery} from '../../../hooks/queries';
import {formatMoney, formatStatus} from '../../../utils/format';
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '../../../components/feedback/StateViews';

type Props = CompositeScreenProps<
  BottomTabScreenProps<AppTabParamList, 'ActivityTab'>,
  NativeStackScreenProps<AppStackParamList>
>;

function toneFor(
  status: string,
): 'success' | 'warning' | 'error' | 'info' | 'neutral' {
  if (status === 'COMPLETED') {
    return 'success';
  }
  if (status === 'FAILED' || status === 'CANCELLED') {
    return 'error';
  }
  return 'info';
}

export function ActivityScreen({navigation}: Props) {
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const {data, isLoading, isError, refetch} = useTransactionsQuery();

  const filtered = useMemo(() => {
    if (!data) {
      return [];
    }
    const q = query.trim().toLowerCase();
    if (!q) {
      return data;
    }
    return data.filter(
      t =>
        t.beneficiaryName.toLowerCase().includes(q) ||
        t.reference.toLowerCase().includes(q) ||
        t.status.toLowerCase().includes(q),
    );
  }, [data, query]);

  if (isLoading) {
    return <LoadingState />;
  }
  if (isError) {
    return (
      <ErrorState message="Impossible de charger l’activité" onRetry={refetch} />
    );
  }

  return (
    <Screen title="Activité" subtitle="Historique de vos transferts.">
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radius.lg,
          borderWidth: 1,
          borderColor: theme.colors.border,
          paddingHorizontal: 14,
          minHeight: 48,
          marginBottom: 16,
          gap: 10,
        }}>
        <Search color={theme.colors.textMuted} size={18} strokeWidth={2} />
        <TextInput
          accessibilityLabel="Rechercher une transaction"
          placeholder="Nom, référence…"
          placeholderTextColor={theme.colors.textMuted}
          value={query}
          onChangeText={setQuery}
          style={{
            flex: 1,
            color: theme.colors.textPrimary,
            fontSize: theme.typography.body,
            paddingVertical: 10,
          }}
        />
      </View>

      {filtered.length === 0 ? (
        <EmptyState
          title="Aucune transaction"
          description="Vos transferts apparaîtront ici."
        />
      ) : (
        filtered.map(txn => (
          <Pressable
            key={txn.id}
            accessibilityRole="button"
            onPress={() =>
              navigation.navigate('TransactionDetail', {
                transactionId: txn.id,
              })
            }
            style={({pressed}) => ({
              backgroundColor: theme.colors.surface,
              borderRadius: theme.radius.lg,
              borderWidth: 1,
              borderColor: theme.colors.border,
              padding: theme.spacing.lg,
              marginBottom: theme.spacing.md,
              opacity: pressed ? 0.88 : 1,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
            })}>
            <View
              style={{
                width: 42,
                height: 42,
                borderRadius: 14,
                backgroundColor: theme.colors.brandPrimarySoft,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: theme.colors.brandPrimary,
                  fontWeight: '800',
                  fontSize: 13,
                }}>
                {txn.beneficiaryName
                  .split(' ')
                  .map(p => p[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </Text>
            </View>
            <View style={{flex: 1}}>
              <Text
                style={{
                  color: theme.colors.textPrimary,
                  fontWeight: '700',
                  fontSize: theme.typography.body,
                }}>
                {txn.beneficiaryName}
              </Text>
              <Text
                style={{
                  color: theme.colors.textMuted,
                  fontSize: theme.typography.caption,
                  marginTop: 3,
                }}>
                {txn.sourceOperatorName} → {txn.destinationOperatorName}
              </Text>
              <View style={{marginTop: 8}}>
                <StatusChip
                  label={formatStatus(txn.status)}
                  tone={toneFor(txn.status)}
                />
              </View>
            </View>
            <View style={{alignItems: 'flex-end', gap: 8}}>
              <Text
                style={{
                  color: theme.colors.textPrimary,
                  fontWeight: '700',
                  fontSize: theme.typography.bodySmall,
                }}>
                {formatMoney(txn.sendAmount, txn.sourceCurrency)}
              </Text>
              <ChevronRight color={theme.colors.textMuted} size={16} />
            </View>
          </Pressable>
        ))
      )}
    </Screen>
  );
}
