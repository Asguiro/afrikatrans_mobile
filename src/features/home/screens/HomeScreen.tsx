import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import type {CompositeScreenProps} from '@react-navigation/native';
import {useFocusEffect} from '@react-navigation/native';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useQueryClient} from '@tanstack/react-query';
import type {
  AppStackParamList,
  AppTabParamList,
} from '../../../navigation/types';
import {Screen} from '../../../components/ui/Screen';
import {Button} from '../../../components/ui/Button';
import {BrandLogo} from '../../../components/brand/BrandLogo';
import {useTheme} from '../../../theme/ThemeProvider';
import {useSessionStore} from '../../../stores/sessionStore';
import {useTransferDraftStore} from '../../../stores/transferDraftStore';
import {
  queryKeys,
  useCountriesQuery,
  useOperatorsQuery,
} from '../../../hooks/queries';
import {
  ErrorState,
  LoadingState,
} from '../../../components/feedback/StateViews';
import {useInputFocusChain} from '../../../hooks/useInputFocusChain';
import {useAppPermissions} from '../../../hooks/useAppPermissions';
import {catalogApi, notificationsApi} from '../../../services/api';
import {unwrap} from '../../../services/api/helpers';
import {loadDeviceContacts} from '../../../services/deviceContacts';
import {
  composePhone,
  parsePhoneAgainstCatalog,
  stripDialCode,
} from '../../../utils/phone';
import {
  MessageCard,
  type AppMessage,
} from '../components/MessageCard';
import {CorridorPartyFields} from '../../transfer/components/CorridorPartyFields';
import {resolveOperator} from '../../transfer/utils/transferMath';
import {
  OPERATOR_BRANDS,
  type OperatorBrandCode,
} from '../../transfer/constants/operatorBrands';
import type {Operator} from '../../../types/api';

type Props = CompositeScreenProps<
  BottomTabScreenProps<AppTabParamList, 'HomeTab'>,
  NativeStackScreenProps<AppStackParamList>
>;

function availableBrandCodes(operators: Operator[] | undefined): Set<string> {
  const codes = new Set<string>();
  for (const op of operators ?? []) {
    if (op.status === 'AVAILABLE') {
      codes.add(op.code);
    }
  }
  return codes;
}

function disabledBrandCodes(operators: Operator[] | undefined): string[] {
  if (!operators) {
    return [];
  }
  const available = availableBrandCodes(operators);
  return OPERATOR_BRANDS.map(b => b.code).filter(code => !available.has(code));
}

function pickAvailableBrand(
  operators: Operator[] | undefined,
  preferred?: string,
): OperatorBrandCode {
  const available = availableBrandCodes(operators);
  if (preferred && available.has(preferred)) {
    return preferred as OperatorBrandCode;
  }
  const first = OPERATOR_BRANDS.find(b => available.has(b.code));
  return first?.code ?? 'ORANGE';
}

export function HomeScreen({navigation}: Props) {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const user = useSessionStore(s => s.user);
  const draft = useTransferDraftStore();
  const setDraft = useTransferDraftStore(s => s.setDraft);
  const resetEpoch = useTransferDraftStore(s => s.resetEpoch);
  const {data: countries, isLoading, isError, refetch} = useCountriesQuery();
  const {ensure} = useAppPermissions();

  const defaultSourceCountry = user?.countryCode ?? 'SN';
  const [sourceCountry, setSourceCountry] = useState(
    draft.sourceCountryCode ?? defaultSourceCountry,
  );
  const [destCountry, setDestCountry] = useState(
    draft.destinationCountryCode ?? 'CI',
  );
  const [sourceOperatorCode, setSourceOperatorCode] = useState(
    draft.sourceOperatorCode ?? 'WAVE',
  );
  const [destOperatorCode, setDestOperatorCode] = useState(
    draft.destinationOperatorCode ?? 'ORANGE',
  );

  const {data: sourceOperators} = useOperatorsQuery(sourceCountry);
  const {data: destOperators} = useOperatorsQuery(destCountry);

  const sourceDisabledOps = useMemo(
    () => disabledBrandCodes(sourceOperators),
    [sourceOperators],
  );
  const destDisabledOps = useMemo(
    () => disabledBrandCodes(destOperators),
    [destOperators],
  );

  useEffect(() => {
    if (!sourceOperators) {
      return;
    }
    setSourceOperatorCode(current =>
      pickAvailableBrand(sourceOperators, current),
    );
  }, [sourceOperators]);

  useEffect(() => {
    if (!destOperators) {
      return;
    }
    setDestOperatorCode(current => pickAvailableBrand(destOperators, current));
  }, [destOperators]);

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
  const [beneficiaryName, setBeneficiaryName] = useState(() =>
    [draft.destinationFirstName, draft.destinationLastName]
      .filter(Boolean)
      .join(' '),
  );
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [inboxMessages, setInboxMessages] = useState<AppMessage[] | undefined>();

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        try {
          const rows = unwrap(await notificationsApi.list());
          if (cancelled || rows.length === 0) {
            return;
          }
          setInboxMessages(
            rows.slice(0, 8).map(n => ({
              id: n.id,
              kind: 'update' as const,
              title: n.title,
              body: n.body,
            })),
          );
        } catch {
          // Garde les messages mock / précédents si l’API est down.
        }
      })();
      return () => {
        cancelled = true;
      };
    }, []),
  );

  /** Après « Fermer » sur le reçu : le draft Zustand est vidé, mais Home (tab) reste monté. */
  useEffect(() => {
    if (resetEpoch === 0) {
      return;
    }
    const srcCountry = defaultSourceCountry;
    const dstCountry = 'CI';
    const srcDialCode =
      countries?.find(c => c.code === srcCountry)?.dialCode ?? '+221';
    setSourceCountry(srcCountry);
    setDestCountry(dstCountry);
    setSourceOperatorCode('WAVE');
    setDestOperatorCode('ORANGE');
    setSourceNumber(stripDialCode(user?.phone ?? '', srcDialCode));
    setDestNumber('');
    setBeneficiaryName('');
    setError(null);
  }, [resetEpoch, countries, defaultSourceCountry, user?.phone]);

  const {fieldProps} = useInputFocusChain([
    'sourcePhone',
    'destPhone',
    'beneficiaryName',
  ] as const);

  /** Synchronise le formulaire après retour du picker contacts. */
  useFocusEffect(
    useCallback(() => {
      const current = useTransferDraftStore.getState();
      if (
        !current.pendingContactApply ||
        !current.destinationPhone ||
        !countries
      ) {
        return;
      }
      const parsed = parsePhoneAgainstCatalog(
        current.destinationPhone,
        countries,
      );
      if (parsed) {
        setDestCountry(parsed.countryCode);
        setDestNumber(parsed.nationalNumber);
      } else if (current.destinationCountryCode) {
        setDestCountry(current.destinationCountryCode);
        const dial =
          countries.find(c => c.code === current.destinationCountryCode)
            ?.dialCode ?? destDial;
        setDestNumber(stripDialCode(current.destinationPhone, dial));
      }
      const name = [
        current.destinationFirstName,
        current.destinationLastName,
      ]
        .filter(Boolean)
        .join(' ');
      if (name) {
        setBeneficiaryName(name);
      }
      if (current.destinationOperatorCode) {
        setDestOperatorCode(current.destinationOperatorCode);
      }
      setDraft({pendingContactApply: false});
    }, [countries, destDial, setDraft]),
  );

  const clearBeneficiaryIdentity = useCallback(() => {
    setBeneficiaryName('');
    setDraft({
      destinationFirstName: undefined,
      destinationLastName: undefined,
      destinationPhone: undefined,
      beneficiaryId: undefined,
    });
  }, [setDraft]);

  const onDestNumberChange = useCallback(
    (digits: string) => {
      setDestNumber(digits);
      if (!digits.trim()) {
        clearBeneficiaryIdentity();
      }
    },
    [clearBeneficiaryIdentity],
  );

  const onBeneficiaryNameChange = useCallback(
    (value: string) => {
      setBeneficiaryName(value);
      if (!value.trim()) {
        setDraft({
          destinationFirstName: undefined,
          destinationLastName: undefined,
        });
      }
    },
    [setDraft],
  );

  const openContactPicker = async () => {
    const allowed = await ensure('contacts');
    if (!allowed) {
      return;
    }
    void queryClient.prefetchQuery({
      queryKey: queryKeys.deviceContacts,
      queryFn: () => loadDeviceContacts(),
      staleTime: 5 * 60 * 1000,
    });
    navigation.navigate('ContactPicker');
  };

  const onContinue = async () => {
    setError(null);
    if (!countries) {
      setError('Catalogue pays indisponible');
      return;
    }
    if (sourceNumber.length < 8 || destNumber.length < 8) {
      setError('Vérifiez les numéros de téléphone');
      return;
    }
    if (!beneficiaryName.trim()) {
      setError('Indiquez le nom du bénéficiaire');
      return;
    }

    setBusy(true);
    try {
      const operators = unwrap(await catalogApi.listOperators());
      const sourceOp = resolveOperator(
        operators,
        sourceCountry,
        sourceOperatorCode,
      );
      const destOp = resolveOperator(
        operators,
        destCountry,
        destOperatorCode,
      );

      if (!sourceOp || sourceOp.status !== 'AVAILABLE') {
        setError('Opérateur payeur indisponible pour ce pays.');
        return;
      }
      if (!destOp || destOp.status !== 'AVAILABLE') {
        const destName =
          countries.find(c => c.code === destCountry)?.name ?? destCountry;
        setError(`Opérateur destinataire indisponible en ${destName}.`);
        return;
      }

      const nameParts = beneficiaryName.trim().split(/\s+/);
      const firstName = nameParts[0] ?? 'Destinataire';
      const lastName = nameParts.slice(1).join(' ') || destNumber.slice(-4);

      setDraft({
        sourceOperatorCode,
        destinationOperatorCode: destOperatorCode,
        sourceCountryCode: sourceCountry,
        destinationCountryCode: destCountry,
        sourceOperatorId: sourceOp.id,
        destinationOperatorId: destOp.id,
        sourceAccountPhone: composePhone(sourceDial, sourceNumber),
        destinationPhone: composePhone(destDial, destNumber),
        destinationFirstName: firstName,
        destinationLastName: lastName,
        amount: undefined,
        amountMode: 'SEND',
        quoteId: undefined,
      });

      navigation.navigate('Transfer', {screen: 'Amount'});
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Impossible de continuer');
    } finally {
      setBusy(false);
    }
  };

  const sourcePhoneField = fieldProps('sourcePhone');
  const destPhoneField = fieldProps('destPhone');
  const nameField = fieldProps('beneficiaryName', {
    onLastSubmit: () => {
      void onContinue();
    },
  });

  if (isLoading) {
    return <LoadingState />;
  }
  if (isError || !countries) {
    return <ErrorState message="Pays indisponibles" onRetry={refetch} />;
  }

  return (
    <Screen scroll>
      <View style={styles.header}>
        <View style={{flex: 1}}>
          <Text
            accessibilityRole="header"
            style={{
              color: theme.colors.textPrimary,
              fontSize: theme.typography.h2,
              fontWeight: '800',
            }}>
            Bonjour{user?.firstName ? `, ${user.firstName}` : ''}
          </Text>
        </View>
        <BrandLogo variant="icon" size={40} plate="plain" />
      </View>

      <MessageCard messages={inboxMessages} rotateMs={10000} />

      <CorridorPartyFields
        title="De"
        countries={countries}
        countryCode={sourceCountry}
        nationalNumber={sourceNumber}
        operatorCode={sourceOperatorCode}
        phoneLabel="Numéro à débiter"
        onCountryChange={setSourceCountry}
        onNumberChange={setSourceNumber}
        onOperatorChange={(code: OperatorBrandCode) =>
          setSourceOperatorCode(code)
        }
        disabledOperatorCodes={sourceDisabledOps}
        phoneField={{
          ref: sourcePhoneField.ref,
          returnKeyType:
            sourcePhoneField.returnKeyType === 'next' ? 'next' : 'done',
          submitBehavior: sourcePhoneField.submitBehavior,
          accessoryActionLabel: sourcePhoneField.accessoryActionLabel,
          onSubmitEditing: sourcePhoneField.onSubmitEditing,
        }}
      />

      <CorridorPartyFields
        title="Vers"
        countries={countries}
        countryCode={destCountry}
        nationalNumber={destNumber}
        operatorCode={destOperatorCode}
        phoneLabel="Numéro du bénéficiaire"
        onCountryChange={setDestCountry}
        onNumberChange={onDestNumberChange}
        onOperatorChange={(code: OperatorBrandCode) =>
          setDestOperatorCode(code)
        }
        disabledOperatorCodes={destDisabledOps}
        onContactPress={() => {
          void openContactPicker();
        }}
        beneficiaryName={beneficiaryName}
        onBeneficiaryNameChange={onBeneficiaryNameChange}
        phoneField={{
          ref: destPhoneField.ref,
          returnKeyType:
            destPhoneField.returnKeyType === 'next' ? 'next' : 'done',
          submitBehavior: destPhoneField.submitBehavior,
          accessoryActionLabel: destPhoneField.accessoryActionLabel,
          onSubmitEditing: destPhoneField.onSubmitEditing,
        }}
        nameField={{
          ref: nameField.ref,
          returnKeyType: nameField.returnKeyType === 'next' ? 'next' : 'done',
          submitBehavior: nameField.submitBehavior,
          onSubmitEditing: nameField.onSubmitEditing,
        }}
      />

      {error ? (
        <Text style={{color: theme.colors.error, marginBottom: 12}}>
          {error}
        </Text>
      ) : null}

      <Button label="Continuer" loading={busy} onPress={onContinue} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
});
