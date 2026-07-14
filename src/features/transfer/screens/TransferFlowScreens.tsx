import React, {useEffect, useMemo, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {TransferStackParamList} from '../../../navigation/types';
import type {Quote} from '../../../types/api';
import {authApi, catalogApi, transferApi} from '../../../services/api';
import {Screen} from '../../../components/ui/Screen';
import {Button} from '../../../components/ui/Button';
import {TextField} from '../../../components/ui/TextField';
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
import {pinSchema} from '../../../schemas/forms';
import {unwrap, createId} from '../../../services/api/helpers';
import {formatMoney, formatStatus} from '../../../utils/format';
import {useTheme} from '../../../theme/ThemeProvider';
import {
  ErrorState,
  LoadingState,
} from '../../../components/feedback/StateViews';
import {useInputFocusChain} from '../../../hooks/useInputFocusChain';
import {z} from 'zod';
import {AmountComposer} from '../components/AmountComposer';
import {
  OperatorBrandGrid,
  OperatorLogoMark,
} from '../components/OperatorBrandGrid';
import {PhoneCountryField} from '../components/PhoneCountryField';
import {QuoteSummaryCard} from '../components/QuoteSummaryCard';
import {PhysicalReceipt} from '../components/PhysicalReceipt';
import {
  COUNTRY_FLAGS,
  getBrandByCode,
  type OperatorBrandCode,
} from '../constants/operatorBrands';
import {
  estimateTransferAmounts,
  resolveOperator,
  resolveSourceOperator,
} from '../utils/transferMath';

type OperatorProps = NativeStackScreenProps<
  TransferStackParamList,
  'SelectOperator'
>;
type PhonesProps = NativeStackScreenProps<
  TransferStackParamList,
  'TransferPhones'
>;
type AmountProps = NativeStackScreenProps<TransferStackParamList, 'Amount'>;
type QuoteProps = NativeStackScreenProps<TransferStackParamList, 'Quote'>;
type PinProps = NativeStackScreenProps<TransferStackParamList, 'ConfirmPin'>;
type ProcessingProps = NativeStackScreenProps<
  TransferStackParamList,
  'Processing'
>;
type SuccessProps = NativeStackScreenProps<TransferStackParamList, 'Success'>;
type ReceiptProps = NativeStackScreenProps<TransferStackParamList, 'Receipt'>;

function stripDialCode(phone: string, dialCode: string): string {
  const digits = phone.replace(/\D/g, '');
  const dialDigits = dialCode.replace(/\D/g, '');
  if (digits.startsWith(dialDigits)) {
    return digits.slice(dialDigits.length);
  }
  return digits;
}

export function SelectOperatorScreen({navigation}: OperatorProps) {
  const theme = useTheme();
  const reset = useTransferDraftStore(s => s.reset);
  const setDraft = useTransferDraftStore(s => s.setDraft);
  const selected = useTransferDraftStore(s => s.destinationOperatorCode);

  return (
    <Screen
      title="Envoyer de l’argent"
      subtitle="Choisissez le réseau du destinataire.">
      <OperatorBrandGrid
        selectedCode={selected}
        onSelect={(code: OperatorBrandCode) => {
          reset();
          setDraft({destinationOperatorCode: code});
          navigation.navigate('TransferPhones');
        }}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Annuler le transfert"
        onPress={() => navigation.getParent()?.goBack()}
        style={({pressed}) => ({
          marginTop: theme.spacing['2xl'],
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: theme.controlHeights.medium,
          paddingHorizontal: theme.spacing.lg,
          opacity: pressed ? 0.7 : 1,
        })}>
        <Text style={{color: theme.colors.textSecondary, fontWeight: '600'}}>
          Annuler
        </Text>
      </Pressable>
    </Screen>
  );
}

export function TransferPhonesScreen({navigation}: PhonesProps) {
  const theme = useTheme();
  const user = useSessionStore(s => s.user);
  const draft = useTransferDraftStore();
  const setDraft = useTransferDraftStore(s => s.setDraft);
  const {data: countries, isLoading, isError, refetch} = useCountriesQuery();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const {fieldProps} = useInputFocusChain([
    'sourcePhone',
    'destPhone',
    'firstName',
    'lastName',
  ] as const);

  const defaultSourceCountry = user?.countryCode ?? 'SN';
  const [sourceCountry, setSourceCountry] = useState(
    draft.sourceCountryCode ?? defaultSourceCountry,
  );
  const [destCountry, setDestCountry] = useState(
    draft.destinationCountryCode ?? 'CI',
  );

  const sourceDial =
    countries?.find(c => c.code === sourceCountry)?.dialCode ?? '+221';
  const destDial =
    countries?.find(c => c.code === destCountry)?.dialCode ?? '+225';

  const [sourceNumber, setSourceNumber] = useState(() =>
    stripDialCode(
      draft.sourceAccountPhone ?? user?.phone ?? '771234567',
      sourceDial,
    ),
  );
  const [destNumber, setDestNumber] = useState(() =>
    stripDialCode(draft.destinationPhone ?? '0700123456', destDial),
  );
  const [firstName, setFirstName] = useState(
    draft.destinationFirstName ?? '',
  );
  const [lastName, setLastName] = useState(draft.destinationLastName ?? '');

  const brand = getBrandByCode(draft.destinationOperatorCode);
  const sourceCurrency =
    countries?.find(c => c.code === sourceCountry)?.currency ?? 'XOF';
  const destCurrency =
    countries?.find(c => c.code === destCountry)?.currency ?? 'XOF';

  if (isLoading) {
    return <LoadingState />;
  }
  if (isError || !countries) {
    return <ErrorState message="Pays indisponibles" onRetry={refetch} />;
  }

  const onContinue = async () => {
    setError(null);
    if (!draft.destinationOperatorCode) {
      setError('Choisissez d’abord un réseau');
      return;
    }
    if (sourceNumber.length < 8 || destNumber.length < 8) {
      setError('Vérifiez les numéros de téléphone');
      return;
    }
    setBusy(true);
    try {
      const operators = unwrap(await catalogApi.listOperators());
      const sourceOp = resolveSourceOperator(operators, sourceCountry);
      const destOp = resolveOperator(
        operators,
        destCountry,
        draft.destinationOperatorCode,
      );

      if (!sourceOp || sourceOp.status !== 'AVAILABLE') {
        setError('Aucun réseau payeur disponible pour ce pays.');
        return;
      }
      if (!destOp) {
        setError(
          `${brand?.name ?? 'Ce réseau'} n’est pas disponible en ${
            countries.find(c => c.code === destCountry)?.name ?? destCountry
          }.`,
        );
        return;
      }
      if (destOp.status !== 'AVAILABLE') {
        setError(`${destOp.name} est en maintenance.`);
        return;
      }

      setDraft({
        sourceCountryCode: sourceCountry,
        destinationCountryCode: destCountry,
        sourceOperatorId: sourceOp.id,
        destinationOperatorId: destOp.id,
        sourceAccountPhone: `${sourceDial}${sourceNumber}`,
        destinationPhone: `${destDial}${destNumber}`,
        destinationFirstName: firstName.trim() || 'Destinataire',
        destinationLastName: lastName.trim() || destNumber.slice(-4),
      });
      navigation.navigate('Amount');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Impossible de continuer');
    } finally {
      setBusy(false);
    }
  };

  const sourcePhoneField = fieldProps('sourcePhone');
  const destPhoneField = fieldProps('destPhone');
  const firstNameField = fieldProps('firstName');
  const lastNameField = fieldProps('lastName', {
    onLastSubmit: () => {
      void onContinue();
    },
  });

  return (
    <Screen
      title="Numéros"
      subtitle={
        brand
          ? `Envoi vers ${brand.name} · devises ${sourceCurrency} / ${destCurrency}`
          : 'Expéditeur et destinataire'
      }>
      {brand ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: theme.spacing.xl,
            gap: 12,
          }}>
          <OperatorLogoMark brand={brand} size={48} />
          <Text
            style={{
              color: theme.colors.textPrimary,
              fontWeight: '700',
              fontSize: theme.typography.body,
              flex: 1,
            }}>
            {brand.name}
          </Text>
        </View>
      ) : null}
      <PhoneCountryField
        ref={sourcePhoneField.ref}
        label="Votre numéro (payeur)"
        countries={countries}
        countryCode={sourceCountry}
        nationalNumber={sourceNumber}
        onCountryChange={setSourceCountry}
        onNumberChange={setSourceNumber}
        hint={`Devise débit : ${sourceCurrency}`}
        returnKeyType={sourcePhoneField.returnKeyType}
        submitBehavior={sourcePhoneField.submitBehavior}
        accessoryActionLabel={sourcePhoneField.accessoryActionLabel}
        onSubmitEditing={sourcePhoneField.onSubmitEditing}
      />
      <PhoneCountryField
        ref={destPhoneField.ref}
        label="Numéro du destinataire"
        countries={countries}
        countryCode={destCountry}
        nationalNumber={destNumber}
        onCountryChange={setDestCountry}
        onNumberChange={setDestNumber}
        hint={`Devise crédit : ${destCurrency}`}
        returnKeyType={destPhoneField.returnKeyType}
        submitBehavior={destPhoneField.submitBehavior}
        accessoryActionLabel={destPhoneField.accessoryActionLabel}
        onSubmitEditing={destPhoneField.onSubmitEditing}
      />

      <Text
        style={{
          color: theme.colors.textPrimary,
          fontWeight: '600',
          marginBottom: theme.spacing.sm,
        }}>
        Nom du destinataire (optionnel)
      </Text>
      <View style={{flexDirection: 'row', gap: 12, marginBottom: 16}}>
        <View style={{flex: 1}}>
          <TextField
            ref={firstNameField.ref}
            label="Prénom"
            autoCapitalize="words"
            value={firstName}
            onChangeText={setFirstName}
            returnKeyType={firstNameField.returnKeyType}
            submitBehavior={firstNameField.submitBehavior}
            onSubmitEditing={firstNameField.onSubmitEditing}
          />
        </View>
        <View style={{flex: 1}}>
          <TextField
            ref={lastNameField.ref}
            label="Nom"
            autoCapitalize="words"
            value={lastName}
            onChangeText={setLastName}
            returnKeyType={lastNameField.returnKeyType}
            submitBehavior={lastNameField.submitBehavior}
            onSubmitEditing={lastNameField.onSubmitEditing}
          />
        </View>
      </View>

      {error ? (
        <Text style={{color: theme.colors.error, marginBottom: 12}}>{error}</Text>
      ) : null}
      <Button label="Continuer" loading={busy} onPress={onContinue} />
    </Screen>
  );
}

export function AmountScreen({navigation}: AmountProps) {
  const theme = useTheme();
  const draft = useTransferDraftStore();
  const setDraft = useTransferDraftStore(s => s.setDraft);
  const createQuote = useCreateQuoteMutation();
  const {data: countries} = useCountriesQuery();
  const [error, setError] = useState<string | null>(null);
  const [sendText, setSendText] = useState(
    draft.amountMode === 'SEND' && draft.amount
      ? String(draft.amount)
      : '25000',
  );
  const [receiveText, setReceiveText] = useState('');
  const [activeField, setActiveField] = useState<'SEND' | 'RECEIVE'>('SEND');
  const {fieldProps} = useInputFocusChain(['send', 'receive'] as const);

  const currency =
    countries?.find(c => c.code === draft.sourceCountryCode)?.currency ??
    'XOF';

  const syncFromSend = (raw: string) => {
    const amount = Number(raw.replace(/\D/g, '')) || 0;
    setSendText(raw.replace(/\D/g, ''));
    setActiveField('SEND');
    const est = estimateTransferAmounts(amount, 'SEND');
    setReceiveText(amount > 0 ? String(est.receiveAmount) : '');
    setDraft({amountMode: 'SEND', amount: amount || undefined});
  };

  const syncFromReceive = (raw: string) => {
    const amount = Number(raw.replace(/\D/g, '')) || 0;
    setReceiveText(raw.replace(/\D/g, ''));
    setActiveField('RECEIVE');
    const est = estimateTransferAmounts(amount, 'RECEIVE');
    setSendText(amount > 0 ? String(est.totalDebitAmount) : '');
    setDraft({amountMode: 'RECEIVE', amount: amount || undefined});
  };

  useEffect(() => {
    syncFromSend(sendText);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- init once
  }, []);

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
      setError('Parcours incomplet');
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
      navigation.navigate('Quote');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Devis impossible');
    }
  };

  const sendField = fieldProps('send');
  const receiveField = fieldProps('receive', {
    onLastSubmit: () => {
      void onSubmit();
    },
  });

  const brand = getBrandByCode(draft.destinationOperatorCode);
  const sourceFlag = COUNTRY_FLAGS[draft.sourceCountryCode ?? ''] ?? '';
  const destFlag = COUNTRY_FLAGS[draft.destinationCountryCode ?? ''] ?? '';
  const beneficiaryName = [draft.destinationFirstName, draft.destinationLastName]
    .filter(Boolean)
    .join(' ');

  return (
    <Screen
      title="Combien ?"
      subtitle="Saisissez le montant à envoyer, ou celui que le destinataire doit recevoir.">
      <View
        style={[
          amountStyles.corridor,
          {
            backgroundColor: theme.colors.brandPrimarySoft,
            borderColor: theme.colors.border,
            borderRadius: theme.radius.lg,
          },
        ]}>
        {brand ? <OperatorLogoMark brand={brand} size={44} /> : null}
        <View style={{flex: 1, marginLeft: brand ? 12 : 0}}>
          <Text
            style={{
              color: theme.colors.textPrimary,
              fontWeight: '700',
              fontSize: theme.typography.body,
            }}>
            {sourceFlag} {draft.sourceCountryCode ?? '—'} → {destFlag}{' '}
            {draft.destinationCountryCode ?? '—'}
            {brand ? ` · ${brand.name}` : ''}
          </Text>
          {beneficiaryName ? (
            <Text
              style={{
                color: theme.colors.textSecondary,
                fontSize: theme.typography.caption,
                marginTop: 2,
              }}>
              Pour {beneficiaryName}
            </Text>
          ) : null}
        </View>
      </View>

      <AmountComposer
        sendDigits={sendText}
        receiveDigits={receiveText}
        currency={currency}
        activeField={activeField}
        feeAmount={preview.feeAmount}
        sendHelper={
          preview.sendAmount > 0 && activeField === 'SEND'
            ? `Frais déduits · le destinataire reçoit ${formatMoney(preview.receiveAmount, currency)}`
            : activeField === 'RECEIVE' && preview.totalDebitAmount > 0
              ? 'Total prélevé sur votre compte (reçu + frais)'
              : 'Appuyez ici pour indiquer ce que vous envoyez'
        }
        receiveHelper={
          preview.receiveAmount > 0 && activeField === 'RECEIVE'
            ? `Vous êtes débité de ${formatMoney(preview.totalDebitAmount, currency)}`
            : 'Appuyez ici pour fixer le montant net reçu'
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

      {error ? (
        <Text style={{color: theme.colors.error, marginBottom: 12}}>{error}</Text>
      ) : null}
      <Button
        label="Voir le devis"
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
    padding: 14,
    marginBottom: 20,
  },
});

export function QuoteScreen({navigation}: QuoteProps) {
  const theme = useTheme();
  const quoteId = useTransferDraftStore(s => s.quoteId);
  const draft = useTransferDraftStore();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  if (!quote && !error) {
    return <LoadingState label="Chargement du devis…" />;
  }
  if (error || !quote) {
    return (
      <ErrorState
        message={error ?? 'Devis introuvable'}
        onRetry={() => navigation.navigate('Amount')}
      />
    );
  }

  const brand = getBrandByCode(draft.destinationOperatorCode);
  const corridor = `${quote.sourceCountryCode} → ${quote.destinationCountryCode}${
    brand ? ` · ${brand.name}` : ''
  }`;

  return (
    <Screen title="Confirmez le devis" subtitle="Vérifiez les montants avant le PIN.">
      <QuoteSummaryCard quote={quote} corridorLabel={corridor} />
      <Text style={{color: theme.colors.textSecondary, marginBottom: 16}}>
        Destinataire : {draft.destinationFirstName} {draft.destinationLastName}
        {'\n'}
        {draft.destinationPhone}
      </Text>
      <Button
        label="Confirmer avec le PIN"
        onPress={() => navigation.navigate('ConfirmPin')}
      />
      <Button
        label="Modifier le montant"
        variant="ghost"
        onPress={() => navigation.navigate('Amount')}
        style={{marginTop: 8}}
      />
    </Screen>
  );
}

export function ConfirmTransferPinScreen({navigation}: PinProps) {
  const theme = useTheme();
  const draft = useTransferDraftStore();
  const createTxn = useCreateTransactionMutation();
  const upsertBeneficiary = useUpsertBeneficiaryMutation();
  const {data: beneficiaries} = useBeneficiariesQuery();
  const [error, setError] = useState<string | null>(null);
  const {control, handleSubmit, formState} = useForm<z.infer<typeof pinSchema>>({
    resolver: zodResolver(pinSchema),
    defaultValues: {pin: ''},
  });
  const {fieldProps} = useInputFocusChain(['pin'] as const);

  const onSubmit = handleSubmit(async values => {
    setError(null);
    try {
      unwrap(await authApi.verifyPin(values.pin));
      if (
        !draft.quoteId ||
        !draft.destinationOperatorId ||
        !draft.destinationPhone ||
        !draft.destinationCountryCode
      ) {
        setError('Parcours incomplet');
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
        purpose: draft.purpose ?? 'aide familiale',
        idempotencyKey: createId('idem'),
      });
      navigation.replace('Processing', {transactionId: txn.id});
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Confirmation impossible');
    }
  });

  const pinField = fieldProps('pin', {
    onLastSubmit: () => {
      void onSubmit();
    },
  });

  return (
    <Screen title="Confirmation" subtitle="Entrez votre PIN pour valider.">
      <Controller
        control={control}
        name="pin"
        render={({field: {onChange, value}}) => (
          <TextField
            ref={pinField.ref}
            label="PIN"
            secureTextEntry
            keyboardType="number-pad"
            maxLength={6}
            value={value}
            onChangeText={onChange}
            error={formState.errors.pin?.message}
            returnKeyType={pinField.returnKeyType}
            submitBehavior={pinField.submitBehavior}
            accessoryActionLabel={pinField.accessoryActionLabel}
            onSubmitEditing={pinField.onSubmitEditing}
          />
        )}
      />
      {error ? (
        <Text style={{color: theme.colors.error, marginBottom: 12}}>{error}</Text>
      ) : null}
      <Button
        label="Envoyer"
        loading={
          createTxn.isPending ||
          upsertBeneficiary.isPending ||
          formState.isSubmitting
        }
        onPress={onSubmit}
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
    <Screen title="Envoi en cours" subtitle="Patientez quelques instants…" scroll={false}>
      <LoadingState label={formatStatus(data?.status ?? 'PENDING_DEBIT')} />
    </Screen>
  );
}

export function SuccessScreen({navigation, route}: SuccessProps) {
  const theme = useTheme();
  const {data, isLoading} = useTransactionQuery(route.params.transactionId);
  if (isLoading || !data) {
    return <LoadingState />;
  }
  const ok = data.status === 'COMPLETED';
  return (
    <Screen
      title={ok ? 'Argent envoyé' : 'Statut'}
      subtitle={formatStatus(data.status)}>
      <View
        style={{
          backgroundColor: ok ? theme.colors.successSoft : theme.colors.errorSoft,
          borderRadius: theme.radius.lg,
          padding: theme.spacing['2xl'],
          marginBottom: theme.spacing['2xl'],
          alignItems: 'center',
        }}>
        <Text
          style={{
            color: ok ? theme.colors.success : theme.colors.error,
            fontSize: 28,
            fontWeight: '900',
          }}>
          {formatMoney(data.receiveAmount, data.destinationCurrency)}
        </Text>
        <Text
          style={{
            color: theme.colors.textSecondary,
            marginTop: 8,
            textAlign: 'center',
          }}>
          reçus par {data.beneficiaryName}
        </Text>
      </View>
      <Button
        label="Voir le reçu"
        onPress={() =>
          navigation.navigate('Receipt', {transactionId: data.id})
        }
      />
      <Button
        label="Terminer"
        variant="secondary"
        onPress={() => navigation.getParent()?.goBack()}
        style={{marginTop: 12}}
      />
    </Screen>
  );
}

export function ReceiptScreen({navigation, route}: ReceiptProps) {
  const {data, isLoading, isError, refetch} = useTransactionQuery(
    route.params.transactionId,
  );
  if (isLoading) {
    return <LoadingState />;
  }
  if (isError || !data) {
    return <ErrorState message="Reçu indisponible" onRetry={refetch} />;
  }
  return (
    <Screen title="Reçu">
      <PhysicalReceipt transaction={data} />
      <Button label="Fermer" onPress={() => navigation.getParent()?.goBack()} />
    </Screen>
  );
}
