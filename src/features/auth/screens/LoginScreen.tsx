import React, {useMemo, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {AuthStackParamList} from '../../../navigation/types';
import {Screen} from '../../../components/ui/Screen';
import {TextField} from '../../../components/ui/TextField';
import {PhoneCountryField} from '../../../components/ui/PhoneCountryField';
import {Button} from '../../../components/ui/Button';
import {BrandLogo} from '../../../components/brand/BrandLogo';
import {loginSchema} from '../../../schemas/forms';
import {authApi} from '../../../services/api';
import {unwrap} from '../../../services/api/helpers';
import {useSessionStore} from '../../../stores/sessionStore';
import {useTheme} from '../../../theme/ThemeProvider';
import {useInputFocusChain} from '../../../hooks/useInputFocusChain';
import {useCountriesQuery} from '../../../hooks/queries';
import {composePhone} from '../../../utils/phone';
import {
  ErrorState,
  LoadingState,
} from '../../../components/feedback/StateViews';
import {z} from 'zod';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;
type FormValues = z.infer<typeof loginSchema>;

export function LoginScreen({navigation}: Props) {
  const theme = useTheme();
  const setSession = useSessionStore(s => s.setSession);
  const [error, setError] = useState<string | null>(null);
  const {data: countries, isLoading, isError, refetch} = useCountriesQuery();
  const {control, handleSubmit, formState, watch, setValue} =
    useForm<FormValues>({
      resolver: zodResolver(loginSchema),
      defaultValues: {
        countryCode: 'SN',
        nationalNumber: '771234567',
        password: 'Demo1234!',
      },
    });
  const {fieldProps, focus} = useInputFocusChain(['password'] as const);

  const countryCode = watch('countryCode');
  const selectedCountry = useMemo(
    () => countries?.find(c => c.code === countryCode) ?? countries?.[0],
    [countries, countryCode],
  );

  const onSubmit = handleSubmit(async values => {
    setError(null);
    try {
      const dial = selectedCountry?.dialCode ?? '+221';
      const phone = composePhone(dial, values.nationalNumber);
      const result = unwrap(
        await authApi.login({phone, password: values.password}),
      );
      await setSession(result.user, result.tokens);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Connexion impossible');
    }
  });

  const passwordField = fieldProps('password', {
    onLastSubmit: () => {
      void onSubmit();
    },
    lastReturnKeyType: 'go',
  });

  if (isLoading) {
    return <LoadingState />;
  }
  if (isError || !countries) {
    return (
      <ErrorState message="Impossible de charger les pays" onRetry={refetch} />
    );
  }

  return (
    <Screen>
      <View style={styles.brand}>
        <BrandLogo variant="icon" size={72} plate="plain" showTagline />
      </View>
      <Text
        accessibilityRole="header"
        style={{
          color: theme.colors.textPrimary,
          fontSize: theme.typography.h3,
          fontWeight: '800',
          letterSpacing: -0.3,
          marginBottom: theme.spacing.sm,
        }}>
        Bon retour
      </Text>
      <Text
        style={{
          color: theme.colors.textSecondary,
          fontSize: theme.typography.body,
          marginBottom: theme.spacing['2xl'],
          lineHeight: 22,
        }}>
        Connectez-vous avec votre numéro Mobile Money.
      </Text>
      <Controller
        control={control}
        name="nationalNumber"
        render={({field: {onChange, value}}) => (
          <PhoneCountryField
            label="Téléphone"
            countries={countries}
            countryCode={countryCode}
            nationalNumber={value}
            onCountryChange={code =>
              setValue('countryCode', code, {shouldValidate: true})
            }
            onNumberChange={onChange}
            hint="Démo : Sénégal · 771234567"
            error={formState.errors.nationalNumber?.message}
            returnKeyType="next"
            submitBehavior="submit"
            accessoryActionLabel="Suivant"
            onSubmitEditing={() => focus('password')}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({field: {onChange, value}}) => (
          <TextField
            ref={passwordField.ref}
            label="Mot de passe"
            secureTextEntry
            value={value}
            onChangeText={onChange}
            error={formState.errors.password?.message}
            returnKeyType={passwordField.returnKeyType}
            submitBehavior={passwordField.submitBehavior}
            onSubmitEditing={passwordField.onSubmitEditing}
          />
        )}
      />
      {error ? (
        <Text style={{color: theme.colors.error, marginBottom: 12}}>
          {error}
        </Text>
      ) : null}
      <Button
        label="Se connecter"
        loading={formState.isSubmitting}
        onPress={onSubmit}
      />
      <Button
        label="Mot de passe oublié"
        variant="ghost"
        onPress={() => navigation.navigate('ForgotPassword')}
        style={{marginTop: 12}}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  brand: {alignItems: 'center', marginBottom: 28},
});
