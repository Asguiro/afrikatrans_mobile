import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {BackHandler, StyleSheet, Text, View} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {AuthStackParamList} from '../../../navigation/types';
import {Screen} from '../../../components/ui/Screen';
import {TextField} from '../../../components/ui/TextField';
import {PhoneCountryField} from '../../../components/ui/PhoneCountryField';
import {Button} from '../../../components/ui/Button';
import {AuthStepIndicator} from '../../../components/auth/AuthStepIndicator';
import {
  registerIdentitySchema,
  registerPasswordSchema,
  registerPhoneSchema,
} from '../../../schemas/forms';
import {authApi} from '../../../services/api';
import {unwrap} from '../../../services/api/helpers';
import {useTheme} from '../../../theme/ThemeProvider';
import {useInputFocusChain} from '../../../hooks/useInputFocusChain';
import {useCountriesQuery} from '../../../hooks/queries';
import {useRegisterDraftStore} from '../../../stores/registerDraftStore';
import {composePhone} from '../../../utils/phone';
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '../../../components/feedback/StateViews';
import {z} from 'zod';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;
type Step = 0 | 1 | 2;

type IdentityValues = z.infer<typeof registerIdentitySchema>;
type PhoneValues = z.infer<typeof registerPhoneSchema>;
type PasswordValues = z.infer<typeof registerPasswordSchema>;

const STEP_META: Array<{label: string; title: string; subtitle: string}> = [
  {
    label: 'Identité',
    title: 'Qui êtes-vous ?',
    subtitle: 'Vos informations apparaîtront sur vos reçus.',
  },
  {
    label: 'Téléphone',
    title: 'Votre numéro',
    subtitle: 'Choisissez le pays, puis saisissez le numéro national.',
  },
  {
    label: 'Sécurité',
    title: 'Protégez votre compte',
    subtitle: 'Un mot de passe d’au moins 6 caractères.',
  },
];

const AUTH_TOTAL_STEPS = 6;

export function RegisterScreen({navigation}: Props) {
  const theme = useTheme();
  const [step, setStep] = useState<Step>(0);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const draft = useRegisterDraftStore();
  const {
    data: countries,
    isLoading,
    isError,
    refetch,
  } = useCountriesQuery();

  const identityForm = useForm<IdentityValues>({
    resolver: zodResolver(registerIdentitySchema),
    defaultValues: {
      firstName: draft.firstName,
      lastName: draft.lastName,
    },
  });
  const phoneForm = useForm<PhoneValues>({
    resolver: zodResolver(registerPhoneSchema),
    defaultValues: {
      countryCode: draft.countryCode || 'SN',
      nationalNumber: draft.nationalNumber,
    },
  });
  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(registerPasswordSchema),
    defaultValues: {password: '', confirmPassword: ''},
  });

  const identityChain = useInputFocusChain(['firstName', 'lastName'] as const);
  const passwordChain = useInputFocusChain([
    'password',
    'confirmPassword',
  ] as const);

  const meta = STEP_META[step];
  const progressStep = step + 1;

  const countryList = countries ?? [];
  const countryCode = phoneForm.watch('countryCode');
  const selectedCountry = useMemo(
    () => countryList.find(c => c.code === countryCode) ?? countryList[0],
    [countryList, countryCode],
  );

  const goBackStep = useCallback(() => {
    if (step === 0) {
      navigation.goBack();
      return true;
    }
    setStep(prev => (prev - 1) as Step);
    return true;
  }, [navigation, step]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', goBackStep);
    return () => sub.remove();
  }, [goBackStep]);

  useEffect(() => {
    navigation.setOptions({
      headerBackVisible: true,
      title: 'Créer un compte',
    });
  }, [navigation]);

  const onIdentityNext = identityForm.handleSubmit(values => {
    draft.setIdentity(values.firstName.trim(), values.lastName.trim());
    setStep(1);
  });

  const onPhoneNext = phoneForm.handleSubmit(values => {
    const dial = selectedCountry?.dialCode ?? '+221';
    const phone = composePhone(dial, values.nationalNumber);
    draft.setPhoneDraft({
      countryCode: values.countryCode,
      nationalNumber: values.nationalNumber,
      phone,
    });
    setStep(2);
  });

  const onPasswordSubmit = passwordForm.handleSubmit(async values => {
    setSubmitError(null);
    setSubmitting(true);
    try {
      draft.setPassword(values.password);
      const snapshot = useRegisterDraftStore.getState();
      unwrap(
        await authApi.register({
          firstName: snapshot.firstName,
          lastName: snapshot.lastName,
          countryCode: snapshot.countryCode,
          phone: snapshot.phone,
          password: values.password,
        }),
      );
      navigation.navigate('VerifyOtp', {phone: snapshot.phone});
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'Inscription impossible');
    } finally {
      setSubmitting(false);
    }
  });

  if (isLoading) {
    return <LoadingState />;
  }
  if (isError || !countries) {
    return (
      <ErrorState message="Impossible de charger les pays" onRetry={refetch} />
    );
  }
  if (countries.length === 0) {
    return (
      <Screen title="Créer un compte">
        <EmptyState title="Aucun pays disponible" />
      </Screen>
    );
  }

  const firstNameField = identityChain.fieldProps('firstName');
  const lastNameField = identityChain.fieldProps('lastName', {
    onLastSubmit: () => {
      void onIdentityNext();
    },
  });
  const phoneField = {
    returnKeyType: 'next' as const,
    submitBehavior: 'submit' as const,
    accessoryActionLabel: 'Suivant',
    onSubmitEditing: () => {
      void onPhoneNext();
    },
  };
  const passwordField = passwordChain.fieldProps('password');
  const confirmField = passwordChain.fieldProps('confirmPassword', {
    onLastSubmit: () => {
      void onPasswordSubmit();
    },
  });

  return (
    <Screen title={meta.title} subtitle={meta.subtitle}>
      <AuthStepIndicator
        step={progressStep}
        total={AUTH_TOTAL_STEPS}
        label={meta.label}
      />

      {step === 0 ? (
        <View style={styles.row}>
          <View style={styles.half}>
            <Controller
              control={identityForm.control}
              name="firstName"
              render={({field: {onChange, value}}) => (
                <TextField
                  ref={firstNameField.ref}
                  label="Prénom"
                  autoCapitalize="words"
                  autoComplete="given-name"
                  value={value}
                  onChangeText={onChange}
                  error={identityForm.formState.errors.firstName?.message}
                  returnKeyType={firstNameField.returnKeyType}
                  submitBehavior={firstNameField.submitBehavior}
                  onSubmitEditing={firstNameField.onSubmitEditing}
                />
              )}
            />
          </View>
          <View style={styles.half}>
            <Controller
              control={identityForm.control}
              name="lastName"
              render={({field: {onChange, value}}) => (
                <TextField
                  ref={lastNameField.ref}
                  label="Nom"
                  autoCapitalize="words"
                  autoComplete="family-name"
                  value={value}
                  onChangeText={onChange}
                  error={identityForm.formState.errors.lastName?.message}
                  returnKeyType={lastNameField.returnKeyType}
                  submitBehavior={lastNameField.submitBehavior}
                  onSubmitEditing={lastNameField.onSubmitEditing}
                />
              )}
            />
          </View>
        </View>
      ) : null}

      {step === 1 ? (
        <Controller
          control={phoneForm.control}
          name="nationalNumber"
          render={({field: {onChange, value}}) => (
            <PhoneCountryField
              label="Numéro mobile"
              countries={countryList}
              countryCode={countryCode}
              nationalNumber={value}
              onCountryChange={code =>
                phoneForm.setValue('countryCode', code, {shouldValidate: true})
              }
              onNumberChange={onChange}
              hint={
                selectedCountry
                  ? `${selectedCountry.name} · ${selectedCountry.currency}`
                  : undefined
              }
              error={phoneForm.formState.errors.nationalNumber?.message}
              returnKeyType={phoneField.returnKeyType}
              submitBehavior={phoneField.submitBehavior}
              accessoryActionLabel={phoneField.accessoryActionLabel}
              onSubmitEditing={phoneField.onSubmitEditing}
            />
          )}
        />
      ) : null}

      {step === 2 ? (
        <>
          <View
            style={[
              styles.summary,
              {
                backgroundColor: theme.colors.brandPrimarySoft,
                borderRadius: theme.radius.lg,
                borderColor: theme.colors.border,
              },
            ]}>
            <Text
              style={{
                color: theme.colors.textSecondary,
                fontSize: theme.typography.caption,
                marginBottom: 4,
              }}>
              Compte
            </Text>
            <Text
              style={{
                color: theme.colors.textPrimary,
                fontWeight: '700',
                fontSize: theme.typography.body,
              }}>
              {draft.firstName} {draft.lastName}
            </Text>
            <Text
              style={{
                color: theme.colors.textSecondary,
                marginTop: 4,
                fontSize: theme.typography.bodySmall,
              }}>
              {draft.phone}
            </Text>
          </View>
          <Controller
            control={passwordForm.control}
            name="password"
            render={({field: {onChange, value}}) => (
              <TextField
                ref={passwordField.ref}
                label="Mot de passe"
                secureTextEntry
                autoComplete="new-password"
                value={value}
                onChangeText={onChange}
                error={passwordForm.formState.errors.password?.message}
                returnKeyType={passwordField.returnKeyType}
                submitBehavior={passwordField.submitBehavior}
                onSubmitEditing={passwordField.onSubmitEditing}
              />
            )}
          />
          <Controller
            control={passwordForm.control}
            name="confirmPassword"
            render={({field: {onChange, value}}) => (
              <TextField
                ref={confirmField.ref}
                label="Confirmer"
                secureTextEntry
                autoComplete="new-password"
                value={value}
                onChangeText={onChange}
                error={passwordForm.formState.errors.confirmPassword?.message}
                returnKeyType={confirmField.returnKeyType}
                submitBehavior={confirmField.submitBehavior}
                onSubmitEditing={confirmField.onSubmitEditing}
              />
            )}
          />
        </>
      ) : null}

      {submitError ? (
        <Text style={{color: theme.colors.error, marginBottom: 12}}>
          {submitError}
        </Text>
      ) : null}

      {step < 2 ? (
        <Button
          label="Continuer"
          onPress={step === 0 ? onIdentityNext : onPhoneNext}
        />
      ) : (
        <Button
          label="Recevoir le code"
          loading={submitting}
          onPress={onPasswordSubmit}
        />
      )}

      {step > 0 ? (
        <Button
          label="Retour"
          variant="ghost"
          onPress={goBackStep}
          style={{marginTop: 8}}
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {flexDirection: 'row', gap: 12},
  half: {flex: 1},
  summary: {
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 20,
  },
});
