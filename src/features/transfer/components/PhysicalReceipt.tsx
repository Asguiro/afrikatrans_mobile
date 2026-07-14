import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import type {Transaction} from '../../../types/api';
import {useTheme} from '../../../theme/ThemeProvider';
import {formatMoney, formatStatus} from '../../../utils/format';

type Props = {
  transaction: Transaction;
};

function DashedDivider() {
  const theme = useTheme();
  return (
    <View style={styles.dashRow}>
      {Array.from({length: 28}).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dash,
            {backgroundColor: theme.colors.border},
          ]}
        />
      ))}
    </View>
  );
}

export function PhysicalReceipt({transaction}: Props) {
  const theme = useTheme();
  const created = new Date(transaction.createdAt);

  const lines: Array<[string, string]> = [
    ['Référence', transaction.reference],
    ['Statut', formatStatus(transaction.status)],
    ['Date', created.toLocaleDateString('fr-FR')],
    [
      'Heure',
      created.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    ],
    ['Bénéficiaire', transaction.beneficiaryName],
    [
      'Corridor',
      `${transaction.sourceCountryCode} → ${transaction.destinationCountryCode}`,
    ],
    ['De', transaction.sourceOperatorName],
    ['Vers', transaction.destinationOperatorName],
  ];

  return (
    <View style={styles.wrapper}>
      {/* perforations */}
      <View style={styles.perfRow}>
        {Array.from({length: 12}).map((_, i) => (
          <View
            key={i}
            style={[
              styles.perf,
              {backgroundColor: theme.colors.background},
            ]}
          />
        ))}
      </View>

      <View
        style={[
          styles.paper,
          {
            backgroundColor: theme.isDark ? '#1A2336' : '#FFFEF8',
            borderColor: theme.colors.border,
          },
        ]}>
        <Text
          style={{
            textAlign: 'center',
            color: theme.colors.brandPrimary,
            fontWeight: '900',
            fontSize: 22,
            letterSpacing: 1,
          }}>
          AFRIKATRANS
        </Text>
        <Text
          style={{
            textAlign: 'center',
            color: theme.colors.textMuted,
            fontSize: 12,
            marginTop: 4,
            marginBottom: 8,
          }}>
          Reçu de transfert Mobile Money
        </Text>

        <DashedDivider />

        {lines.map(([label, value]) => (
          <View key={label} style={styles.line}>
            <Text style={{color: theme.colors.textMuted, fontSize: 13}}>
              {label}
            </Text>
            <Text
              style={{
                color: theme.colors.textPrimary,
                fontWeight: '600',
                fontSize: 13,
                maxWidth: '58%',
                textAlign: 'right',
              }}>
              {value}
            </Text>
          </View>
        ))}

        <DashedDivider />

        <View style={styles.line}>
          <Text style={{color: theme.colors.textSecondary}}>Envoyé</Text>
          <Text style={{fontWeight: '700', color: theme.colors.textPrimary}}>
            {formatMoney(transaction.sendAmount, transaction.sourceCurrency)}
          </Text>
        </View>
        <View style={styles.line}>
          <Text style={{color: theme.colors.textSecondary}}>Frais</Text>
          <Text style={{fontWeight: '700', color: theme.colors.textPrimary}}>
            {formatMoney(transaction.feeAmount, transaction.sourceCurrency)}
          </Text>
        </View>
        <View style={styles.line}>
          <Text style={{color: theme.colors.textSecondary}}>Total débité</Text>
          <Text style={{fontWeight: '800', color: theme.colors.textPrimary}}>
            {formatMoney(
              transaction.totalDebitAmount,
              transaction.sourceCurrency,
            )}
          </Text>
        </View>

        <View
          style={[
            styles.receiveBox,
            {backgroundColor: theme.colors.successSoft},
          ]}>
          <Text
            style={{
              color: theme.colors.success,
              fontSize: 12,
              fontWeight: '600',
              textAlign: 'center',
            }}>
            Montant reçu
          </Text>
          <Text
            style={{
              color: theme.colors.success,
              fontSize: 26,
              fontWeight: '900',
              textAlign: 'center',
              marginTop: 4,
            }}>
            {formatMoney(
              transaction.receiveAmount,
              transaction.destinationCurrency,
            )}
          </Text>
        </View>

        <DashedDivider />

        <Text
          style={{
            textAlign: 'center',
            color: theme.colors.textMuted,
            fontSize: 11,
            marginTop: 4,
          }}>
          Merci d’avoir choisi AfrikaTrans
        </Text>
        <Text
          style={{
            textAlign: 'center',
            color: theme.colors.textMuted,
            fontSize: 10,
            marginTop: 2,
            letterSpacing: 1,
          }}>
          *** fin du reçu ***
        </Text>
      </View>

      <View style={styles.perfRow}>
        {Array.from({length: 12}).map((_, i) => (
          <View
            key={i}
            style={[
              styles.perf,
              {backgroundColor: theme.colors.background},
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 20,
  },
  perfRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    zIndex: 2,
    marginVertical: -8,
  },
  perf: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  paper: {
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 4},
    elevation: 3,
  },
  dashRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 14,
    overflow: 'hidden',
  },
  dash: {
    width: 6,
    height: 1.5,
  },
  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  receiveBox: {
    marginTop: 8,
    marginBottom: 4,
    padding: 14,
    borderRadius: 8,
  },
});
