import React from 'react';
import {Text, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {AppStackParamList} from '../../../navigation/types';
import {Screen} from '../../../components/ui/Screen';
import {Button} from '../../../components/ui/Button';
import {ListGroup, ListRow, StatusChip} from '../../../components/ui/ListRow';
import {useTransactionQuery} from '../../../hooks/queries';
import {formatMoney, formatStatus} from '../../../utils/format';
import {
  ErrorState,
  LoadingState,
} from '../../../components/feedback/StateViews';
import {useTheme} from '../../../theme/ThemeProvider';

type Props = NativeStackScreenProps<AppStackParamList, 'TransactionDetail'>;

function statusTone(
  status: string,
): 'success' | 'warning' | 'error' | 'info' | 'neutral' {
  if (status === 'COMPLETED') {
    return 'success';
  }
  if (status === 'FAILED' || status === 'CANCELLED') {
    return 'error';
  }
  if (status.includes('PENDING') || status === 'DEBITED' || status === 'CREATED') {
    return 'info';
  }
  return 'neutral';
}

export function TransactionDetailScreen({navigation, route}: Props) {
  const theme = useTheme();
  const {data, isLoading, isError, refetch} = useTransactionQuery(
    route.params.transactionId,
  );

  if (isLoading) {
    return <LoadingState />;
  }
  if (isError || !data) {
    return (
      <ErrorState message="Transaction introuvable" onRetry={refetch} />
    );
  }

  const created = new Date(data.createdAt);

  return (
    <Screen title="Détail du transfert">
      <View
        style={{
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radius.xl,
          borderWidth: 1,
          borderColor: theme.colors.border,
          padding: theme.spacing['2xl'],
          marginBottom: theme.spacing.xl,
          alignItems: 'center',
        }}>
        <StatusChip
          label={formatStatus(data.status)}
          tone={statusTone(data.status)}
        />
        <Text
          style={{
            color: theme.colors.textMuted,
            fontSize: theme.typography.caption,
            marginTop: 14,
          }}>
          Montant reçu
        </Text>
        <Text
          style={{
            color: theme.colors.textPrimary,
            fontSize: 28,
            fontWeight: '800',
            marginTop: 4,
          }}>
          {formatMoney(data.receiveAmount, data.destinationCurrency)}
        </Text>
        <Text
          style={{
            color: theme.colors.textSecondary,
            marginTop: 8,
            fontSize: theme.typography.bodySmall,
            textAlign: 'center',
          }}>
          pour {data.beneficiaryName}
        </Text>
      </View>

      <ListGroup title="Montants">
        <ListRow
          label="Envoyé"
          value={formatMoney(data.sendAmount, data.sourceCurrency)}
        />
        <ListRow
          label="Frais"
          value={formatMoney(data.feeAmount, data.sourceCurrency)}
        />
        <ListRow
          label="Total débité"
          value={formatMoney(data.totalDebitAmount, data.sourceCurrency)}
          last
        />
      </ListGroup>

      <ListGroup title="Corridor">
        <ListRow
          label="Pays"
          value={`${data.sourceCountryCode} → ${data.destinationCountryCode}`}
        />
        <ListRow
          label="Réseaux"
          value={`${data.sourceOperatorName} → ${data.destinationOperatorName}`}
          last
        />
      </ListGroup>

      <ListGroup title="Référence">
        <ListRow label="Code" value={data.reference} />
        <ListRow
          label="Date"
          value={created.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        />
        <ListRow
          label="Heure"
          value={created.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
          last
        />
      </ListGroup>

      <Button
        label="Voir le reçu"
        onPress={() =>
          navigation.navigate('Transfer', {
            screen: 'Receipt',
            params: {transactionId: data.id},
          })
        }
      />
    </Screen>
  );
}
