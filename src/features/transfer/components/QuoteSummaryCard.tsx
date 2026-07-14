import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import type {Quote} from '../../../types/api';
import {useTheme} from '../../../theme/ThemeProvider';
import {formatMoney} from '../../../utils/format';

type Props = {
  quote: Quote;
  corridorLabel?: string;
};

export function QuoteSummaryCard({quote, corridorLabel}: Props) {
  const theme = useTheme();

  const rows: Array<{label: string; value: string; emphasize?: boolean}> = [
    {
      label: 'Montant envoyé',
      value: formatMoney(quote.sendAmount, quote.sourceCurrency),
    },
    {
      label: 'Frais de transfert',
      value: formatMoney(quote.feeAmount, quote.sourceCurrency),
    },
    {
      label: 'Vous êtes débité',
      value: formatMoney(quote.totalDebitAmount, quote.sourceCurrency),
      emphasize: true,
    },
    {
      label: 'Le destinataire reçoit',
      value: formatMoney(quote.receiveAmount, quote.destinationCurrency),
      emphasize: true,
    },
  ];

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
      <View
        style={[
          styles.header,
          {backgroundColor: theme.colors.brandPrimary},
        ]}>
        <Text style={[styles.headerTitle, {color: theme.colors.onBrandPrimary}]}>
          Votre devis
        </Text>
        {corridorLabel ? (
          <Text
            style={[
              styles.headerSub,
              {color: theme.colors.onBrandPrimary, opacity: 0.85},
            ]}>
            {corridorLabel}
          </Text>
        ) : null}
      </View>

      <View style={{padding: theme.spacing.xl}}>
        {rows.map((row, index) => (
          <View
            key={row.label}
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
              }}>
              {row.label}
            </Text>
            <Text
              style={{
                color: row.emphasize
                  ? theme.colors.brandPrimary
                  : theme.colors.textPrimary,
                fontWeight: row.emphasize ? '800' : '600',
                fontSize: row.emphasize
                  ? theme.typography.h4
                  : theme.typography.body,
                marginTop: 4,
              }}>
              {row.value}
            </Text>
          </View>
        ))}

        <View
          style={[
            styles.meta,
            {backgroundColor: theme.colors.brandPrimarySoft},
          ]}>
          <Text style={{color: theme.colors.textSecondary, fontSize: 13}}>
            Taux {quote.fxRate} · ~{quote.estimatedDeliveryMinutes} min · expire{' '}
            {new Date(quote.expiresAt).toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 20,
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontWeight: '800',
    fontSize: 18,
  },
  headerSub: {
    marginTop: 4,
    fontSize: 13,
  },
  row: {},
  meta: {
    marginTop: 8,
    padding: 12,
    borderRadius: 10,
  },
});
