import React, {useEffect, useState} from 'react';
import {Text} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {KycStackParamList} from '../../../navigation/types';
import {Screen} from '../../../components/ui/Screen';
import {Button} from '../../../components/ui/Button';
import {TextField} from '../../../components/ui/TextField';
import {SelectList} from '../../../components/ui/SelectList';
import {kycPersonalSchema} from '../../../schemas/forms';
import {kycApi} from '../../../services/api';
import {unwrap} from '../../../services/api/helpers';
import {useKycQuery} from '../../../hooks/queries';
import {formatMoney, formatStatus} from '../../../utils/format';
import {useTheme} from '../../../theme/ThemeProvider';
import {useInputFocusChain} from '../../../hooks/useInputFocusChain';
import {
  ErrorState,
  LoadingState,
} from '../../../components/feedback/StateViews';
import {useSessionStore} from '../../../stores/sessionStore';
import {useAppPermissions} from '../../../hooks/useAppPermissions';
import {z} from 'zod';

type IntroProps = NativeStackScreenProps<KycStackParamList, 'KycIntro'>;
type PersonalProps = NativeStackScreenProps<KycStackParamList, 'KycPersonalInfo'>;
type DocumentProps = NativeStackScreenProps<KycStackParamList, 'KycDocument'>;
type SelfieProps = NativeStackScreenProps<KycStackParamList, 'KycSelfie'>;
type StatusProps = NativeStackScreenProps<KycStackParamList, 'KycStatus'>;

export function KycIntroScreen({navigation}: IntroProps) {
  const {data, isLoading, isError, refetch} = useKycQuery();
  if (isLoading) {
    return <LoadingState />;
  }
  if (isError || !data) {
    return <ErrorState message="KYC indisponible" onRetry={refetch} />;
  }
  return (
    <Screen
      title="Vérification d’identité"
      subtitle="KYC progressif pour débloquer vos plafonds.">
      <Text style={{marginBottom: 8}}>Statut : {formatStatus(data.status)}</Text>
      {data.dailyLimit != null ? (
        <Text style={{marginBottom: 16}}>
          Limite journalière : {formatMoney(data.dailyLimit, data.currency ?? 'XOF')}
        </Text>
      ) : null}
      <Button
        label="Continuer"
        onPress={() => navigation.navigate('KycPersonalInfo')}
      />
      <Button
        label="Voir le statut"
        variant="ghost"
        onPress={() => navigation.navigate('KycStatus')}
        style={{marginTop: 12}}
      />
    </Screen>
  );
}

export function KycPersonalInfoScreen({navigation}: PersonalProps) {
  const theme = useTheme();
  const setUser = useSessionStore(s => s.setUser);
  const user = useSessionStore(s => s.user);
  const [error, setError] = useState<string | null>(null);
  const {control, handleSubmit, formState} = useForm<
    z.infer<typeof kycPersonalSchema>
  >({
    resolver: zodResolver(kycPersonalSchema),
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      addressLine: '',
      city: '',
    },
  });
  const {fieldProps} = useInputFocusChain([
    'firstName',
    'lastName',
    'addressLine',
    'city',
  ] as const);

  const onSubmit = handleSubmit(async values => {
    setError(null);
    try {
      const profile = unwrap(await kycApi.submitPersonalInfo(values));
      if (user) {
        setUser({
          ...user,
          firstName: values.firstName,
          lastName: values.lastName,
          kycStatus: profile.status,
        });
      }
      navigation.navigate('KycDocument');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Soumission impossible');
    }
  });

  const firstNameField = fieldProps('firstName');
  const lastNameField = fieldProps('lastName');
  const addressField = fieldProps('addressLine');
  const cityField = fieldProps('city', {
    onLastSubmit: () => {
      void onSubmit();
    },
  });

  return (
    <Screen title="Informations personnelles">
      <Controller
        control={control}
        name="firstName"
        render={({field: {onChange, value}}) => (
          <TextField
            ref={firstNameField.ref}
            label="Prénom"
            autoCapitalize="words"
            value={value}
            onChangeText={onChange}
            returnKeyType={firstNameField.returnKeyType}
            submitBehavior={firstNameField.submitBehavior}
            onSubmitEditing={firstNameField.onSubmitEditing}
          />
        )}
      />
      <Controller
        control={control}
        name="lastName"
        render={({field: {onChange, value}}) => (
          <TextField
            ref={lastNameField.ref}
            label="Nom"
            autoCapitalize="words"
            value={value}
            onChangeText={onChange}
            returnKeyType={lastNameField.returnKeyType}
            submitBehavior={lastNameField.submitBehavior}
            onSubmitEditing={lastNameField.onSubmitEditing}
          />
        )}
      />
      <Controller
        control={control}
        name="addressLine"
        render={({field: {onChange, value}}) => (
          <TextField
            ref={addressField.ref}
            label="Adresse"
            value={value}
            onChangeText={onChange}
            returnKeyType={addressField.returnKeyType}
            submitBehavior={addressField.submitBehavior}
            onSubmitEditing={addressField.onSubmitEditing}
          />
        )}
      />
      <Controller
        control={control}
        name="city"
        render={({field: {onChange, value}}) => (
          <TextField
            ref={cityField.ref}
            label="Ville"
            autoCapitalize="words"
            value={value}
            onChangeText={onChange}
            returnKeyType={cityField.returnKeyType}
            submitBehavior={cityField.submitBehavior}
            onSubmitEditing={cityField.onSubmitEditing}
          />
        )}
      />
      {error ? (
        <Text style={{color: theme.colors.error, marginBottom: 12}}>{error}</Text>
      ) : null}
      <Button
        label="Continuer"
        loading={formState.isSubmitting}
        onPress={onSubmit}
      />
    </Screen>
  );
}

export function KycDocumentScreen({navigation}: DocumentProps) {
  const theme = useTheme();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const {ensure} = useAppPermissions();

  const submit = async (
    documentType: 'PASSPORT' | 'NATIONAL_ID' | 'RESIDENCE_PERMIT',
  ) => {
    const allowed = await ensure('photoLibrary');
    if (!allowed) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      unwrap(await kycApi.submitDocument({documentType}));
      navigation.navigate('KycSelfie');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload impossible');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen
      title="Document d’identité"
      subtitle="Capture mock — aucun OCR local.">
      <SelectList
        options={[
          {id: 'NATIONAL_ID', title: 'Carte nationale'},
          {id: 'PASSPORT', title: 'Passeport'},
          {id: 'RESIDENCE_PERMIT', title: 'Titre de séjour'},
        ]}
        onSelect={id =>
          !loading &&
          submit(id as 'PASSPORT' | 'NATIONAL_ID' | 'RESIDENCE_PERMIT')
        }
      />
      {error ? (
        <Text style={{color: theme.colors.error, marginTop: 12}}>{error}</Text>
      ) : null}
      {loading ? <LoadingState label="Envoi du document…" /> : null}
    </Screen>
  );
}

export function KycSelfieScreen({navigation}: SelfieProps) {
  const theme = useTheme();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const {ensure} = useAppPermissions();

  return (
    <Screen title="Selfie" subtitle="Contrôle vivacité mock.">
      {error ? (
        <Text style={{color: theme.colors.error, marginBottom: 12}}>{error}</Text>
      ) : null}
      <Button
        label="Capturer et envoyer"
        loading={loading}
        onPress={async () => {
          const allowed = await ensure('camera');
          if (!allowed) {
            return;
          }
          setLoading(true);
          setError(null);
          try {
            unwrap(await kycApi.submitSelfie());
            navigation.navigate('KycStatus');
          } catch (e) {
            setError(e instanceof Error ? e.message : 'Selfie impossible');
          } finally {
            setLoading(false);
          }
        }}
      />
    </Screen>
  );
}

export function KycStatusScreen({navigation}: StatusProps) {
  const theme = useTheme();
  const {data, isLoading, isError, refetch} = useKycQuery();
  const setUser = useSessionStore(s => s.setUser);
  const user = useSessionStore(s => s.user);

  useEffect(() => {
    if (user && data && user.kycStatus !== data.status) {
      setUser({...user, kycStatus: data.status});
    }
  }, [data, setUser, user]);

  if (isLoading) {
    return <LoadingState />;
  }
  if (isError || !data) {
    return <ErrorState message="Statut indisponible" onRetry={refetch} />;
  }

  return (
    <Screen title="Statut KYC" subtitle={formatStatus(data.status)}>
      {data.rejectionReason ? (
        <Text style={{color: theme.colors.error, marginBottom: 12}}>
          {data.rejectionReason}
        </Text>
      ) : null}
      <Text style={{color: theme.colors.textSecondary, marginBottom: 8}}>
        Limite / jour :{' '}
        {data.dailyLimit != null
          ? formatMoney(data.dailyLimit, data.currency ?? 'XOF')
          : '—'}
      </Text>
      <Text style={{color: theme.colors.textSecondary, marginBottom: 16}}>
        Limite / mois :{' '}
        {data.monthlyLimit != null
          ? formatMoney(data.monthlyLimit, data.currency ?? 'XOF')
          : '—'}
      </Text>
      <Button
        label="Fermer"
        onPress={() => navigation.getParent()?.goBack()}
      />
    </Screen>
  );
}
