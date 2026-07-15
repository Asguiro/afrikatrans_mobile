import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import type {CompositeScreenProps} from '@react-navigation/native';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
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
import {useCountriesQuery} from '../../../hooks/queries';
import {
  ErrorState,
  LoadingState,
} from '../../../components/feedback/StateViews';
import {useInputFocusChain} from '../../../hooks/useInputFocusChain';
import {catalogApi} from '../../../services/api';
import {unwrap} from '../../../services/api/helpers';
import {composePhone, stripDialCode} from '../../../utils/phone';
import {MessageCard} from '../components/MessageCard';
import {CorridorPartyFields} from '../../transfer/components/CorridorPartyFields';
import {resolveOperator} from '../../transfer/utils/transferMath';
import type {OperatorBrandCode} from '../../transfer/constants/operatorBrands';

type Props = CompositeScreenProps<
  BottomTabScreenProps<AppTabParamList, 'HomeTab'>,
  NativeStackScreenProps<AppStackParamList>
>;

export function HomeScreen({navigation}: Props) {
  const theme = useTheme();
  const user = useSessionStore(s => s.user);
  const draft = useTransferDraftStore();
  const setDraft = useTransferDraftStore(s => s.setDraft);
  const {data: countries, isLoading, isError, refetch} = useCountriesQuery();

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
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const {fieldProps} = useInputFocusChain([
    'sourcePhone',
    'destPhone',
  ] as const);

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

      setDraft({
        sourceOperatorCode,
        destinationOperatorCode: destOperatorCode,
        sourceCountryCode: sourceCountry,
        destinationCountryCode: destCountry,
        sourceOperatorId: sourceOp.id,
        destinationOperatorId: destOp.id,
        sourceAccountPhone: composePhone(sourceDial, sourceNumber),
        destinationPhone: composePhone(destDial, destNumber),
        destinationFirstName: draft.destinationFirstName || 'Destinataire',
        destinationLastName:
          draft.destinationLastName || destNumber.slice(-4),
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
  const destPhoneField = fieldProps('destPhone', {
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

      <MessageCard rotateMs={10000} />

      <CorridorPartyFields
        title="De"
        countries={countries}
        countryCode={sourceCountry}
        nationalNumber={sourceNumber}
        operatorCode={sourceOperatorCode}
        phoneLabel="Numéro de l’expéditeur"
        onCountryChange={setSourceCountry}
        onNumberChange={setSourceNumber}
        onOperatorChange={(code: OperatorBrandCode) =>
          setSourceOperatorCode(code)
        }
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
        onNumberChange={setDestNumber}
        onOperatorChange={(code: OperatorBrandCode) =>
          setDestOperatorCode(code)
        }
        phoneField={{
          ref: destPhoneField.ref,
          returnKeyType:
            destPhoneField.returnKeyType === 'next' ? 'next' : 'done',
          submitBehavior: destPhoneField.submitBehavior,
          accessoryActionLabel: destPhoneField.accessoryActionLabel,
          onSubmitEditing: destPhoneField.onSubmitEditing,
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
