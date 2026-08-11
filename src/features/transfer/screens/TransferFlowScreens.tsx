import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {TransferStackParamList} from '../../../navigation/types';
import type {Quote} from '../../../types/api';
import {authApi, transferApi} from '../../../services/api';
import {Screen} from '../../../components/ui/Screen';
import {Button} from '../../../components/ui/Button';
import {useTransferDraftStore} from '../../../stores/transferDraftStore';
import {useSessionStore} from '../../../stores/sessionStore';
import {
  useBeneficiariesQuery,
  useCountriesQuery,
  useCreateQuoteMutation,
  useCreateTransactionMutation,
  useTransactionQuery,
  useUpsertBeneficiaryMutation,
} from '../../../hooks/queries';
import {unwrap, createId} from '../../../services/api/helpers';
import {formatMoney, formatStatus} from '../../../utils/format';
import {useTheme} from '../../../theme/ThemeProvider';
import {
  ErrorState,
  LoadingState,
} from '../../../components/feedback/StateViews';
import {useInputFocusChain} from '../../../hooks/useInputFocusChain';
import {AmountComposer} from '../components/AmountComposer';
import {TransferRecapCard} from '../components/TransferRecapCard';
import {PhysicalReceipt} from '../components/PhysicalReceipt';
import {ConfirmPinModal} from '../components/ConfirmPinModal';
import {TransferWarningModal} from '../components/TransferWarningModal';
import {shareReceiptAsImage} from '../utils/shareReceiptAsImage';
import {
  COUNTRY_FLAGS,
  getBrandByCode,
} from '../constants/operatorBrands';
import {estimateTransferAmounts} from '../utils/transferMath';
import {OperatorLogoMark} from '../components/OperatorBrandGrid';
import {useAppPermissions} from '../../../hooks/useAppPermissions';
import {usePreferencesStore} from '../../../stores/preferencesStore';

type AmountProps = NativeStackScreenProps<TransferStackParamList, 'Amount'>;
type ReviewProps = NativeStackScreenProps<TransferStackParamList, 'Review'>;
type ProcessingProps = NativeStackScreenProps<
  TransferStackParamList,
  'Processing'
>;
type SuccessProps = NativeStackScreenProps<TransferStackParamList, 'Success'>;
type ReceiptProps = NativeStackScreenProps<TransferStackParamList, 'Receipt'>;

function countryName(
  countries: Array<{code: string; name: string}> | undefined,
  code: string,
): string {
  return countries?.find(c => c.code === code)?.name ?? code;
}

export function AmountScreen({navigation}: AmountProps) {
  const theme = useTheme();
  const draft = useTransferDraftStore();
  const setDraft = useTransferDraftStore(s => s.setDraft);
  const createQuote = useCreateQuoteMutation();
  const {data: countries} = useCountriesQuery();
  const [error, setError] = useState<string | null>(null);
  const [sendText, setSendText] = useState('');
  const [receiveText, setReceiveText] = useState('');
  const [activeField, setActiveField] = useState<'SEND' | 'RECEIVE'>('SEND');
  const {fieldProps} = useInputFocusChain(['send', 'receive'] as const);

  const currency =
    countries?.find(c => c.code === draft.sourceCountryCode)?.currency ??
    'XOF';

  const resetAmounts = () => {
    setSendText('');
    setReceiveText('');
    setActiveField('SEND');
    setError(null);
    setDraft({amount: undefined, amountMode: 'SEND', quoteId: undefined});
  };

  /** Toujours repartir de 0 à l’entrée sur l’écran montant. */
  useEffect(() => {
    resetAmounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount only
  }, []);

  const syncFromSend = (raw: string) => {
    const digits = raw.replace(/\D/g, '');
    const amount = Number(digits) || 0;
    setSendText(digits);
    setActiveField('SEND');
    const est = estimateTransferAmounts(amount, 'SEND');
    setReceiveText(amount > 0 ? String(est.receiveAmount) : '');
    setDraft({amountMode: 'SEND', amount: amount || undefined});
  };

  const syncFromReceive = (raw: string) => {
    const digits = raw.replace(/\D/g, '');
    const amount = Number(digits) || 0;
    setReceiveText(digits);
    setActiveField('RECEIVE');
    const est = estimateTransferAmounts(amount, 'RECEIVE');
    setSendText(amount > 0 ? String(est.totalDebitAmount) : '');
    setDraft({amountMode: 'RECEIVE', amount: amount || undefined});
  };

  const preview = useMemo(() => {
    const amount = Number(
      (activeField === 'SEND' ? sendText : receiveText).replace(/\D/g, ''),
    );
    return estimateTransferAmounts(amount, activeField);
  }, [activeField, sendText, receiveText]);

  const onSubmit = async () => {
    setError(null);
    const amount =
      activeField === 'SEND'
        ? Number(sendText) || 0
        : Number(receiveText) || 0;
    if (amount <= 0) {
      setError('Indiquez un montant');
      return;
    }
    if (
      !draft.sourceCountryCode ||
      !draft.sourceOperatorId ||
      !draft.destinationCountryCode ||
      !draft.destinationOperatorId
    ) {
      setError('Parcours incomplet — reprenez depuis l’accueil.');
      return;
    }
    try {
      const quote = await createQuote.mutateAsync({
        sourceCountryCode: draft.sourceCountryCode,
        sourceOperatorId: draft.sourceOperatorId,
        destinationCountryCode: draft.destinationCountryCode,
        destinationOperatorId: draft.destinationOperatorId,
        amountMode: activeField,
        amount,
      });
      setDraft({amount, amountMode: activeField, quoteId: quote.id});
      navigation.navigate('Review');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Devis impossible');
    }
  };

  if (
    !draft.sourceCountryCode ||
    !draft.destinationCountryCode ||
    !draft.sourceOperatorId ||
    !draft.destinationOperatorId
  ) {
    return (
      <ErrorState
        message="Parcours incomplet. Reprenez depuis l’accueil."
        onRetry={() => navigation.getParent()?.goBack()}
      />
    );
  }

  const sendField = fieldProps('send');
  const receiveField = fieldProps('receive', {
    onLastSubmit: () => {
      void onSubmit();
    },
  });

  const brand = getBrandByCode(draft.destinationOperatorCode);
  const sourceFlag = COUNTRY_FLAGS[draft.sourceCountryCode ?? ''] ?? '';
  const destFlag = COUNTRY_FLAGS[draft.destinationCountryCode ?? ''] ?? '';

  return (
    <Screen>
      <View
        style={[
          amountStyles.corridor,
          {
            backgroundColor: theme.colors.brandPrimarySoft,
            borderColor: theme.colors.border,
            borderRadius: theme.radius.lg,
          },
        ]}>
        {brand ? <OperatorLogoMark brand={brand} size={40} /> : null}
        <View style={{flex: 1, marginLeft: brand ? 12 : 0}}>
          <Text
            style={{
              color: theme.colors.textPrimary,
              fontWeight: '700',
              fontSize: theme.typography.body,
            }}>
            {sourceFlag} {draft.sourceCountryCode} → {destFlag}{' '}
            {draft.destinationCountryCode}
            {brand ? ` · ${brand.name}` : ''}
          </Text>
          <Text
            style={{
              color: theme.colors.textSecondary,
              fontSize: theme.typography.caption,
              marginTop: 2,
            }}>
            {draft.destinationPhone}
          </Text>
        </View>
      </View>

      <AmountComposer
        sendDigits={sendText}
        receiveDigits={receiveText}
        currency={currency}
        activeField={activeField}
        sendHelper={
          preview.sendAmount > 0 && activeField === 'SEND'
            ? `Le destinataire reçoit ${formatMoney(preview.receiveAmount, currency)}`
            : activeField === 'RECEIVE' && preview.totalDebitAmount > 0
              ? 'Total prélevé (reçu + frais)'
              : 'Montant que vous envoyez'
        }
        receiveHelper={
          preview.receiveAmount > 0 && activeField === 'RECEIVE'
            ? `Total à payer ${formatMoney(preview.totalDebitAmount, currency)}`
            : 'Montant net reçu'
        }
        onChangeSend={syncFromSend}
        onChangeReceive={syncFromReceive}
        onFocusField={field => {
          if (field === 'SEND') {
            if (activeField !== 'SEND' && sendText) {
              syncFromSend(sendText);
            } else {
              setActiveField('SEND');
            }
          } else if (activeField !== 'RECEIVE' && receiveText) {
            syncFromReceive(receiveText);
          } else {
            setActiveField('RECEIVE');
          }
        }}
        sendField={{
          ref: sendField.ref,
          returnKeyType: sendField.returnKeyType === 'next' ? 'next' : 'done',
          accessoryActionLabel: sendField.accessoryActionLabel,
          onSubmitEditing: sendField.onSubmitEditing,
        }}
        receiveField={{
          ref: receiveField.ref,
          returnKeyType:
            receiveField.returnKeyType === 'next' ? 'next' : 'done',
          accessoryActionLabel: receiveField.accessoryActionLabel,
          onSubmitEditing: receiveField.onSubmitEditing,
        }}
      />

      <View
        style={[
          amountStyles.summary,
          {
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radius.lg,
          },
        ]}>
        <View style={amountStyles.summaryRow}>
          <Text style={{color: theme.colors.textSecondary, fontWeight: '600'}}>
            Frais estimés
          </Text>
          <Text style={{color: theme.colors.textPrimary, fontWeight: '800'}}>
            {preview.feeAmount > 0
              ? formatMoney(preview.feeAmount, currency)
              : '—'}
          </Text>
        </View>
        <View
          style={[
            amountStyles.summaryDivider,
            {backgroundColor: theme.colors.divider},
          ]}
        />
        <View style={amountStyles.summaryRow}>
          <Text style={{color: theme.colors.textPrimary, fontWeight: '700'}}>
            Total à payer
          </Text>
          <Text style={{color: theme.colors.brandPrimary, fontWeight: '800'}}>
            {preview.totalDebitAmount > 0
              ? formatMoney(preview.totalDebitAmount, currency)
              : '—'}
          </Text>
        </View>
      </View>

      {error ? (
        <Text style={{color: theme.colors.error, marginBottom: 12}}>{error}</Text>
      ) : null}
      <Button
        label="Continuer"
        loading={createQuote.isPending}
        onPress={onSubmit}
      />
    </Screen>
  );
}

const amountStyles = StyleSheet.create({
  corridor: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    padding: 12,
    marginBottom: 16,
  },
  summary: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 4,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  summaryDivider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 8,
  },
});

export function TransferReviewScreen({navigation}: ReviewProps) {
  const theme = useTheme();
  const quoteId = useTransferDraftStore(s => s.quoteId);
  const draft = useTransferDraftStore();
  const {data: countries} = useCountriesQuery();
  const {data: beneficiaries} = useBeneficiariesQuery();
  const createTxn = useCreateTransactionMutation();
  const upsertBeneficiary = useUpsertBeneficiaryMutation();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [warningOpen, setWarningOpen] = useState(false);
  const [pinOpen, setPinOpen] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);
  const isAppLocked = useSessionStore(s => s.isAppLocked);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!quoteId) {
        return;
      }
      try {
        const data = unwrap(await transferApi.getQuote(quoteId));
        if (!cancelled) {
          setQuote(data);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Devis indisponible');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [quoteId]);

  const onConfirmPin = async (pin: string) => {
    setPinError(null);
    try {
      unwrap(await authApi.verifyPin(pin));
      if (
        !draft.quoteId ||
        !draft.destinationOperatorId ||
        !draft.destinationPhone ||
        !draft.destinationCountryCode ||
        !draft.sourceAccountPhone
      ) {
        setPinError('Parcours incomplet');
        return;
      }

      const existing = beneficiaries?.find(
        b => b.phone === draft.destinationPhone,
      );

      const beneficiary = await upsertBeneficiary.mutateAsync({
        id: existing?.id ?? draft.beneficiaryId,
        firstName:
          draft.destinationFirstName ||
          existing?.firstName ||
          'Destinataire',
        lastName: draft.destinationLastName || existing?.lastName || '',
        phone: draft.destinationPhone,
        countryCode: draft.destinationCountryCode,
        operatorId: draft.destinationOperatorId,
      });

      const txn = await createTxn.mutateAsync({
        quoteId: draft.quoteId,
        beneficiaryId: beneficiary.id,
        sourceAccountPhone: draft.sourceAccountPhone,
        purpose: draft.purpose ?? 'aide familiale',
        idempotencyKey: createId('idem'),
      });
      setPinOpen(false);
      navigation.replace('Processing', {transactionId: txn.id});
    } catch (e) {
      setPinError(e instanceof Error ? e.message : 'Confirmation impossible');
    }
  };

  if (!quoteId) {
    return (
      <ErrorState
        message="Aucun devis. Reprenez le montant."
        onRetry={() => navigation.navigate('Amount')}
      />
    );
  }

  if (!quote && !error) {
    return <LoadingState label="Chargement…" />;
  }
  if (error || !quote) {
    return (
      <ErrorState
        message={error ?? 'Devis introuvable'}
        onRetry={() => navigation.navigate('Amount')}
      />
    );
  }

  const sourceOpName =
    getBrandByCode(draft.sourceOperatorCode)?.name ??
    draft.sourceOperatorCode ??
    '—';
  const destOpName =
    getBrandByCode(draft.destinationOperatorCode)?.name ??
    draft.destinationOperatorCode ??
    '—';
  const beneficiaryName = [
    draft.destinationFirstName,
    draft.destinationLastName,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Screen title="Confirmer le paiement">
      <TransferRecapCard
        mode="preview"
        quote={quote}
        sourceCountryName={countryName(countries, quote.sourceCountryCode)}
        destinationCountryName={countryName(
          countries,
          quote.destinationCountryCode,
        )}
        sourceOperatorName={sourceOpName}
        destinationOperatorName={destOpName}
        sourceAccountPhone={draft.sourceAccountPhone ?? '—'}
        destinationPhone={draft.destinationPhone ?? '—'}
        beneficiaryName={beneficiaryName || undefined}
      />
      <Button
        label="Suivant"
        onPress={() => {
          setPinError(null);
          setWarningOpen(true);
        }}
      />
      <Button
        label="Modifier le montant"
        variant="ghost"
        onPress={() => navigation.navigate('Amount')}
        style={{marginTop: 8}}
      />
      <Text
        style={{
          color: theme.colors.textMuted,
          fontSize: theme.typography.caption,
          marginTop: 12,
          textAlign: 'center',
        }}>
        Le numéro de transaction sera attribué après confirmation.
      </Text>

      <TransferWarningModal
        visible={warningOpen && !isAppLocked}
        onClose={() => setWarningOpen(false)}
        onConfirm={() => {
          setWarningOpen(false);
          setPinOpen(true);
        }}
      />

      <ConfirmPinModal
        visible={pinOpen && !isAppLocked}
        loading={createTxn.isPending || upsertBeneficiary.isPending}
        error={pinError}
        summary={`Entrez votre PIN pour confirmer le paiement de ${formatMoney(
          quote.totalDebitAmount,
          quote.sourceCurrency,
        )}${
          beneficiaryName ? ` à ${beneficiaryName}` : ''
        }.`}
        onClose={() => {
          if (!createTxn.isPending && !upsertBeneficiary.isPending) {
            setPinOpen(false);
            setPinError(null);
          }
        }}
        onConfirm={onConfirmPin}
      />
    </Screen>
  );
}

export function ProcessingScreen({navigation, route}: ProcessingProps) {
  const {data} = useTransactionQuery(route.params.transactionId, true);

  useEffect(() => {
    if (data?.status === 'COMPLETED' || data?.status === 'FAILED') {
      navigation.replace('Success', {transactionId: data.id});
    }
  }, [data, navigation]);

  return (
    <Screen scroll={false} centered>
      <LoadingState label={formatStatus(data?.status ?? 'PENDING_DEBIT')} />
    </Screen>
  );
}

export function SuccessScreen({navigation, route}: SuccessProps) {
  const theme = useTheme();
  const resetDraft = useTransferDraftStore(s => s.reset);
  const receiptRef = useRef<View>(null);
  const [sharing, setSharing] = useState(false);
  const {data, isLoading} = useTransactionQuery(route.params.transactionId);
  const {data: countries} = useCountriesQuery();
  const {request, check} = useAppPermissions();
  const notificationsSoftPromptSeen = usePreferencesStore(
    s => s.notificationsSoftPromptSeen,
  );
  const setNotificationsSoftPromptSeen = usePreferencesStore(
    s => s.setNotificationsSoftPromptSeen,
  );

  useEffect(() => {
    if (notificationsSoftPromptSeen) {
      return;
    }
    setNotificationsSoftPromptSeen(true);
    void (async () => {
      const status = await check('notifications');
      if (status === 'undetermined' || status === 'denied') {
        await request('notifications');
      }
    })();
  }, [
    check,
    request,
    notificationsSoftPromptSeen,
    setNotificationsSoftPromptSeen,
  ]);

  if (isLoading || !data) {
    return <LoadingState />;
  }

  const onShare = async () => {
    setSharing(true);
    try {
      await shareReceiptAsImage(receiptRef, data.reference);
    } catch {
      Alert.alert('Partage', 'Impossible de partager le reçu en image.');
    } finally {
      setSharing(false);
    }
  };

  const onFinish = () => {
    resetDraft();
    navigation.getParent()?.goBack();
  };

  const isSuccess = data.status === 'COMPLETED';

  return (
    <Screen>
      <View style={{alignItems: 'center', marginBottom: 16}}>
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: isSuccess
              ? theme.colors.successSoft
              : theme.colors.errorSoft,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 12,
          }}>
          <Text
            style={{
              color: isSuccess ? theme.colors.success : theme.colors.error,
              fontSize: 28,
              fontWeight: '800',
            }}>
            {isSuccess ? '✓' : '!'}
          </Text>
        </View>
        <Text
          accessibilityRole="header"
          style={{
            color: theme.colors.brandPrimary,
            fontWeight: '800',
            fontSize: theme.typography.h3,
            textAlign: 'center',
          }}>
          {isSuccess ? 'Transaction réussie' : 'Transaction terminée'}
        </Text>
        <Text
          style={{
            color: theme.colors.textSecondary,
            marginTop: 6,
            textAlign: 'center',
          }}>
          Merci d’avoir utilisé AfrikaTrans
        </Text>
      </View>

      <PhysicalReceipt
        ref={receiptRef}
        transaction={data}
        sourceCountryName={countryName(countries, data.sourceCountryCode)}
        destinationCountryName={countryName(
          countries,
          data.destinationCountryCode,
        )}
      />
      <Button
        label="Partager"
        onPress={onShare}
        loading={sharing}
      />
      <Button
        label="Fermer"
        variant="secondary"
        onPress={onFinish}
        style={{marginTop: 12}}
      />
    </Screen>
  );
}

export function ReceiptScreen({navigation, route}: ReceiptProps) {
  const receiptRef = useRef<View>(null);
  const [sharing, setSharing] = useState(false);
  const {data, isLoading, isError, refetch} = useTransactionQuery(
    route.params.transactionId,
  );
  const {data: countries} = useCountriesQuery();

  if (isLoading) {
    return <LoadingState />;
  }
  if (isError || !data) {
    return <ErrorState message="Reçu indisponible" onRetry={refetch} />;
  }

  const onShare = async () => {
    setSharing(true);
    try {
      await shareReceiptAsImage(receiptRef, data.reference);
    } catch {
      Alert.alert('Partage', 'Impossible de partager le reçu en image.');
    } finally {
      setSharing(false);
    }
  };

  return (
    <Screen>
      <PhysicalReceipt
        ref={receiptRef}
        transaction={data}
        sourceCountryName={countryName(countries, data.sourceCountryCode)}
        destinationCountryName={countryName(
          countries,
          data.destinationCountryCode,
        )}
      />
      <Button
        label="Partager le reçu"
        onPress={onShare}
        loading={sharing}
      />
      <Button
        label="Fermer"
        variant="secondary"
        onPress={() => navigation.getParent()?.goBack()}
        style={{marginTop: 12}}
      />
    </Screen>
  );
}
