import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import type {Quote, Transaction} from '../../../types/api';
import {useTheme} from '../../../theme/ThemeProvider';
import {
  formatCorridorOperation,
  formatDateTime,
  formatMoney,
  formatStatus,
} from '../../../utils/format';

type PreviewInput = {
  mode: 'preview';
  quote: Quote;
  sourceCountryName: string;
  destinationCountryName: string;
  sourceOperatorName: string;
  destinationOperatorName: string;
  sourceAccountPhone: string;
  destinationPhone: string;
  beneficiaryName?: string;
  /** Sans chrome carte (ex. reçu ticket). */
  embedded?: boolean;
};

type ReceiptInput = {
  mode: 'receipt';
  transaction: Transaction;
  sourceCountryName: string;
  destinationCountryName: string;
  embedded?: boolean;
};

type Props = PreviewInput | ReceiptInput;

type Row = {label: string; value: string; emphasize?: boolean};

export function TransferRecapCard(props: Props) {
  const theme = useTheme();
  const rows = buildRows(props);
  const embedded = props.embedded === true;

  const body = (
    <View style={embedded ? undefined : {padding: theme.spacing.xl}}>
      {rows.map((row, index) => (
        <View
          key={`${row.label}-${index}`}
          style={[
            styles.row,
            index < rows.length - 1 && {
              borderBottomWidth: StyleSheet.hairlineWidth,
              borderBottomColor: theme.colors.divider,
              marginBottom: theme.spacing.md,
              paddingBottom: theme.spacing.md,
            },
          ]}>
          <Text
            style={{
              color: theme.colors.textSecondary,
              fontSize: theme.typography.bodySmall,
              flex: 1,
              paddingRight: 12,
            }}>
            {row.label}
          </Text>
          <Text
            style={{
              color: theme.colors.textPrimary,
              fontWeight: row.emphasize ? '800' : '600',
              fontSize: theme.typography.bodySmall,
              maxWidth: '55%',
              textAlign: 'right',
            }}>
            {row.value}
          </Text>
        </View>
      ))}
    </View>
  );

  if (embedded) {
    return body;
  }

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radius.lg,
          borderColor: theme.colors.border,
        },
      ]}>
      <View style={{paddingHorizontal: theme.spacing.xl, paddingTop: theme.spacing.lg}}>
        <Text
          style={{
            color: theme.colors.brandPrimary,
            fontWeight: '700',
            fontSize: theme.typography.bodySmall,
            marginBottom: theme.spacing.md,
          }}>
          {formatCorridorOperation(
            props.sourceCountryName,
            props.destinationCountryName,
          )}
        </Text>
      </View>
      {body}
    </View>
  );
}

function buildRows(props: Props): Row[] {
  if (props.mode === 'preview') {
    const {quote} = props;
    const rows: Row[] = [
      {
        label: 'Numéro de l’expéditeur',
        value: props.sourceAccountPhone,
      },
      {label: 'Opérateur expéditeur', value: props.sourceOperatorName},
      {
        label: 'Numéro du bénéficiaire',
        value: props.destinationPhone,
      },
      {label: 'Opérateur bénéficiaire', value: props.destinationOperatorName},
    ];
    if (props.beneficiaryName) {
      rows.push({label: 'Bénéficiaire', value: props.beneficiaryName});
    }
    rows.push(
      {
        label: 'Montant envoyé',
        value: formatMoney(quote.sendAmount, quote.sourceCurrency),
      },
      {
        label: 'Frais',
        value: formatMoney(quote.feeAmount, quote.sourceCurrency),
      },
      {
        label: 'Total à payer',
        value: formatMoney(quote.totalDebitAmount, quote.sourceCurrency),
        emphasize: true,
      },
      {
        label: 'Montant reçu',
        value: formatMoney(quote.receiveAmount, quote.destinationCurrency),
        emphasize: true,
      },
    );
    return rows;
  }

  const {transaction} = props;
  return [
    {label: 'Numéro de transaction', value: transaction.reference},
    {label: 'Statut', value: formatStatus(transaction.status)},
    {
      label: 'Date et heure',
      value: formatDateTime(transaction.createdAt),
    },
    {
      label: 'Opération de transfert',
      value: formatCorridorOperation(
        props.sourceCountryName,
        props.destinationCountryName,
      ),
    },
    {
      label: 'Numéro de l’expéditeur',
      value: transaction.sourceAccountPhone,
    },
    {label: 'Opérateur expéditeur', value: transaction.sourceOperatorName},
    {
      label: 'Numéro du bénéficiaire',
      value: transaction.destinationPhone,
    },
    {
      label: 'Opérateur bénéficiaire',
      value: transaction.destinationOperatorName,
    },
    {
      label: 'Bénéficiaire',
      value: transaction.beneficiaryName,
    },
    {
      label: 'Montant envoyé',
      value: formatMoney(transaction.sendAmount, transaction.sourceCurrency),
    },
    {
      label: 'Frais',
      value: formatMoney(transaction.feeAmount, transaction.sourceCurrency),
    },
    {
      label: 'Total à payer',
      value: formatMoney(
        transaction.totalDebitAmount,
        transaction.sourceCurrency,
      ),
      emphasize: true,
    },
    {
      label: 'Montant reçu',
      value: formatMoney(
        transaction.receiveAmount,
        transaction.destinationCurrency,
      ),
      emphasize: true,
    },
  ];
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
});
