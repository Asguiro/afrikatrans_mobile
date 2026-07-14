import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import type {CompositeScreenProps} from '@react-navigation/native';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {
  AppStackParamList,
  AppTabParamList,
} from '../../../navigation/types';
import {Screen} from '../../../components/ui/Screen';
import {BrandLogo} from '../../../components/brand/BrandLogo';
import {useTheme} from '../../../theme/ThemeProvider';
import {useSessionStore} from '../../../stores/sessionStore';
import {useTransactionsQuery} from '../../../hooks/queries';
import {formatMoney, formatStatus} from '../../../utils/format';
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '../../../components/feedback/StateViews';

type Props = CompositeScreenProps<
  BottomTabScreenProps<AppTabParamList, 'HomeTab'>,
  NativeStackScreenProps<AppStackParamList>
>;

export function HomeScreen({navigation}: Props) {
  const theme = useTheme();
  const user = useSessionStore(s => s.user);
  const {data, isLoading, isError, refetch} = useTransactionsQuery();

  return (
    <Screen scroll>
      <View style={styles.header}>
        <View style={{flex: 1}}>
          <Text
            style={{
              color: theme.colors.textMuted,
              fontSize: theme.typography.bodySmall,
              fontWeight: '600',
            }}>
            AfrikaTrans
          </Text>
          <Text
            accessibilityRole="header"
            style={{
              color: theme.colors.textPrimary,
              fontSize: theme.typography.h2,
              fontWeight: '800',
              marginTop: 4,
            }}>
            Bonjour{user?.firstName ? `, ${user.firstName}` : ''}
          </Text>
        </View>
        <BrandLogo variant="icon" size={44} />
      </View>

      <View
        style={[
          styles.hero,
          {
            backgroundColor: theme.colors.brandPrimary,
            borderRadius: theme.radius.xl,
          },
        ]}>
        <Text
          style={{
            color: theme.colors.onBrandPrimary,
            opacity: 0.85,
            fontSize: theme.typography.bodySmall,
            fontWeight: '600',
          }}>
          Mobile Money
        </Text>
        <Text
          style={{
            color: theme.colors.onBrandPrimary,
            fontSize: theme.typography.h3,
            fontWeight: '800',
            marginTop: 8,
            lineHeight: 32,
          }}>
          Envoyez de l’argent en quelques taps
        </Text>
        <Text
          style={{
            color: theme.colors.onBrandPrimary,
            opacity: 0.8,
            marginTop: 8,
            lineHeight: 20,
          }}>
          Wave, Orange Money, MTN, Moov — frais clairs, transfert rapide.
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Envoyer de l’argent"
          onPress={() => navigation.navigate('Transfer')}
          style={({pressed}) => [
            styles.sendBtn,
            {
              backgroundColor: theme.colors.brandAccent,
              opacity: pressed ? 0.9 : 1,
            },
          ]}>
          <Text
            style={{
              color: theme.colors.textPrimary,
              fontWeight: '800',
              fontSize: theme.typography.bodyLarge,
            }}>
            Envoyer
          </Text>
        </Pressable>
      </View>

      <View style={styles.quickRow}>
        <QuickAction
          label="Contacts"
          onPress={() => navigation.navigate('BeneficiariesTab')}
        />
        <QuickAction
          label="Activité"
          onPress={() => navigation.navigate('ActivityTab')}
        />
        <QuickAction
          label="KYC"
          onPress={() => navigation.navigate('Kyc')}
        />
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: theme.spacing.md,
          marginTop: theme.spacing.sm,
        }}>
        <Text
          style={{
            color: theme.colors.textPrimary,
            fontWeight: '700',
            fontSize: theme.typography.h4,
          }}>
          Récents
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Voir toute l’activité"
          hitSlop={8}
          onPress={() => navigation.navigate('ActivityTab')}
          style={{
            minHeight: theme.controlHeights.medium,
            justifyContent: 'center',
            paddingHorizontal: 4,
          }}>
          <Text style={{color: theme.colors.brandPrimary, fontWeight: '600'}}>
            Tout voir
          </Text>
        </Pressable>
      </View>

      {isLoading ? <LoadingState /> : null}
      {isError ? (
        <ErrorState message="Historique indisponible" onRetry={refetch} />
      ) : null}
      {data?.slice(0, 5).map(txn => (
        <Pressable
          key={txn.id}
          accessibilityRole="button"
          onPress={() =>
            navigation.navigate('TransactionDetail', {
              transactionId: txn.id,
            })
          }
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radius.lg,
            padding: theme.spacing.lg,
            marginBottom: theme.spacing.md,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            borderWidth: 1,
            borderColor: theme.colors.border,
          }}>
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: theme.colors.brandPrimarySoft,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: theme.colors.brandPrimary,
                fontWeight: '800',
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
            <Text style={{color: theme.colors.textPrimary, fontWeight: '700'}}>
              {txn.beneficiaryName}
            </Text>
            <Text style={{color: theme.colors.textSecondary, marginTop: 2}}>
              {txn.sourceOperatorName} → {txn.destinationOperatorName}
            </Text>
          </View>
          <View style={{alignItems: 'flex-end'}}>
            <Text style={{color: theme.colors.textPrimary, fontWeight: '700'}}>
              {formatMoney(txn.sendAmount, txn.sourceCurrency)}
            </Text>
            <Text
              style={{
                color: theme.colors.textMuted,
                fontSize: theme.typography.caption,
                marginTop: 2,
              }}>
              {formatStatus(txn.status)}
            </Text>
          </View>
        </Pressable>
      ))}
      {data && data.length === 0 ? (
        <EmptyState
          title="Aucun transfert"
          description="Touchez Envoyer pour démarrer votre premier transfert."
          actionLabel="Envoyer"
          onAction={() => navigation.navigate('Transfer')}
        />
      ) : null}
    </Screen>
  );
}

function QuickAction({label, onPress}: {label: string; onPress: () => void}) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({pressed}) => [
        {
          flex: 1,
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radius.md,
          borderWidth: 1,
          borderColor: theme.colors.border,
          paddingVertical: theme.spacing.md,
          minHeight: theme.controlHeights.medium,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: pressed ? 0.85 : 1,
        },
      ]}>
      <Text
        style={{
          color: theme.colors.textPrimary,
          fontWeight: '600',
          fontSize: theme.typography.bodySmall,
        }}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  hero: {
    padding: 24,
    marginBottom: 16,
  },
  sendBtn: {
    marginTop: 20,
    borderRadius: 14,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
});
