import React, {useMemo, useState} from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type {CompositeScreenProps} from '@react-navigation/native';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Search, ChevronRight} from 'lucide-react-native';
import type {
  AppStackParamList,
  AppTabParamList,
} from '../../../navigation/types';
import {Screen} from '../../../components/ui/Screen';
import {useTheme} from '../../../theme/ThemeProvider';
import {useTransactionsQuery} from '../../../hooks/queries';
import {
  formatCorridorCodes,
  formatHistoryDateTime,
  formatMoney,
} from '../../../utils/format';
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '../../../components/feedback/StateViews';
import type {Transaction} from '../../../types/api';

type Props = CompositeScreenProps<
  BottomTabScreenProps<AppTabParamList, 'ActivityTab'>,
  NativeStackScreenProps<AppStackParamList>
>;

const ROW_HEIGHT = 64;

function shortName(full: string): string {
  const parts = full.trim().split(/\s+/);
  if (parts.length <= 1) {
    return full;
  }
  const last = parts[parts.length - 1];
  return `${parts[0]} ${last.charAt(0)}.`;
}

export function ActivityScreen({navigation}: Props) {
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const {data, isLoading, isError, refetch} = useTransactionsQuery();

  const filtered = useMemo(() => {
    if (!data) {
      return [];
    }
    // Historique = transferts réussis uniquement.
    const succeeded = data.filter(t => t.status === 'COMPLETED');
    const q = query.trim().toLowerCase();
    if (!q) {
      return succeeded;
    }
    return succeeded.filter(
      t =>
        t.beneficiaryName.toLowerCase().includes(q) ||
        t.destinationPhone.toLowerCase().includes(q) ||
        t.reference.toLowerCase().includes(q),
    );
  }, [data, query]);

  const renderItem = ({
    item: txn,
    index,
  }: {
    item: Transaction;
    index: number;
  }) => {
    const last = index === filtered.length - 1;
    const phoneLocal = txn.destinationPhone.replace(/^\+\d+/, '').trim();
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Envoyé à ${txn.beneficiaryName}`}
        onPress={() =>
          navigation.navigate('TransactionDetail', {
            transactionId: txn.id,
          })
        }
        style={({pressed}) => ({
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          paddingHorizontal: 12,
          paddingVertical: 8,
          minHeight: ROW_HEIGHT,
          opacity: pressed ? 0.72 : 1,
          borderBottomWidth: last ? 0 : StyleSheet.hairlineWidth,
          borderBottomColor: theme.colors.divider,
        })}>
        <View style={{flex: 1, minWidth: 0}}>
          <Text
            numberOfLines={1}
            style={{
              color: theme.colors.textPrimary,
              fontWeight: '600',
              fontSize: theme.typography.bodySmall,
            }}>
            Envoyé à {shortName(txn.beneficiaryName)}
            {phoneLocal ? ` ${phoneLocal}` : ''}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              color: theme.colors.textMuted,
              fontSize: theme.typography.caption,
              marginTop: 2,
            }}>
            {formatHistoryDateTime(txn.createdAt)}
            {' · '}
            {formatCorridorCodes(
              txn.sourceCountryCode,
              txn.destinationCountryCode,
            )}
          </Text>
        </View>
        <Text
          style={{
            color: theme.colors.textPrimary,
            fontWeight: '700',
            fontSize: theme.typography.bodySmall,
          }}>
          - {formatMoney(txn.receiveAmount, txn.destinationCurrency)}
        </Text>
        <ChevronRight color={theme.colors.textMuted} size={16} />
      </Pressable>
    );
  };

  if (isLoading) {
    return <LoadingState />;
  }
  if (isError) {
    return (
      <ErrorState
        message="Impossible de charger l’historique"
        onRetry={refetch}
      />
    );
  }

  return (
    <Screen
      title="Historique"
      subtitle="Transferts réussis."
      scroll={false}
      style={{flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radius.lg,
          borderWidth: 1,
          borderColor: theme.colors.border,
          paddingHorizontal: 14,
          minHeight: 44,
          marginBottom: 10,
          gap: 10,
        }}>
        <Search color={theme.colors.textMuted} size={18} strokeWidth={2} />
        <TextInput
          accessibilityLabel="Rechercher une transaction"
          placeholder="Saisir un nom ou un numéro"
          placeholderTextColor={theme.colors.textMuted}
          value={query}
          onChangeText={setQuery}
          style={{
            flex: 1,
            color: theme.colors.textPrimary,
            fontSize: theme.typography.body,
            paddingVertical: 8,
          }}
        />
      </View>

      {filtered.length === 0 ? (
        <EmptyState
          title="Aucune transaction"
          description="Vos transferts réussis apparaîtront ici."
        />
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radius.lg,
            borderWidth: 1,
            borderColor: theme.colors.border,
            overflow: 'hidden',
          }}>
          <FlatList
            data={filtered}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            keyboardShouldPersistTaps="handled"
            initialNumToRender={16}
            getItemLayout={(_data, index) => ({
              length: ROW_HEIGHT,
              offset: ROW_HEIGHT * index,
              index,
            })}
          />
        </View>
      )}
    </Screen>
  );
}
