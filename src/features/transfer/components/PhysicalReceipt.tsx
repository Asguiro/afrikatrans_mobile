import React, {forwardRef} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import type {Transaction} from '../../../types/api';
import {useTheme} from '../../../theme/ThemeProvider';
import {TransferRecapCard} from './TransferRecapCard';

type Props = {
  transaction: Transaction;
  sourceCountryName: string;
  destinationCountryName: string;
};

function DashedDivider() {
  const theme = useTheme();
  return (
    <View style={styles.dashRow}>
      {Array.from({length: 28}).map((_, i) => (
        <View
          key={i}
          style={[styles.dash, {backgroundColor: theme.colors.border}]}
        />
      ))}
    </View>
  );
}

export const PhysicalReceipt = forwardRef<View, Props>(function PhysicalReceipt(
  {transaction, sourceCountryName, destinationCountryName},
  ref,
) {
  const theme = useTheme();
  const paperBg = theme.isDark ? '#1A2336' : '#FFFEF8';

  return (
    <View ref={ref} collapsable={false} style={styles.wrapper}>
      <View style={styles.perfRow}>
        {Array.from({length: 12}).map((_, i) => (
          <View key={i} style={[styles.perf, {backgroundColor: paperBg}]} />
        ))}
      </View>

      <View
        style={[
          styles.paper,
          {
            backgroundColor: paperBg,
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

        <TransferRecapCard
          mode="receipt"
          transaction={transaction}
          sourceCountryName={sourceCountryName}
          destinationCountryName={destinationCountryName}
          embedded
        />

        <Text
          style={{
            textAlign: 'center',
            color: theme.colors.textMuted,
            fontSize: 11,
            marginTop: 4,
          }}>
          Merci d’avoir utilisé AfrikaTrans
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
          <View key={i} style={[styles.perf, {backgroundColor: paperBg}]} />
        ))}
      </View>
    </View>
  );
});

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
    paddingHorizontal: 12,
    paddingVertical: 20,
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
});
