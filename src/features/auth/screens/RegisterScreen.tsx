import React, {useState} from 'react';
import {Text} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {AuthStackParamList} from '../../../navigation/types';
import {Screen} from '../../../components/ui/Screen';
import {TextField} from '../../../components/ui/TextField';
import {Button} from '../../../components/ui/Button';
import {registerSchema} from '../../../schemas/forms';
import {authApi} from '../../../services/api';
import {unwrap} from '../../../services/api/helpers';
import {useTheme} from '../../../theme/ThemeProvider';
import {useInputFocusChain} from '../../../hooks/useInputFocusChain';
import {z} from 'zod';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;
type FormValues = z.infer<typeof registerSchema>;

export function RegisterScreen({navigation, route}: Props) {
  const theme = useTheme();
  const [error, setError] = useState<string | null>(null);
  const {control, handleSubmit, formState} = useForm<FormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      countryCode: route.params.countryCode,
      phone: '',
      firstName: '',
      lastName: '',
      password: '',
    },
  });
  const {fieldProps} = useInputFocusChain([
    'firstName',
    'lastName',
    'phone',
    'password',
  ] as const);

  const onSubmit = handleSubmit(async values => {
    setError(null);
    try {
      unwrap(await authApi.register(values));
      navigation.navigate('VerifyOtp', {phone: values.phone});
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Inscription impossible');
    }
  });

  const firstNameField = fieldProps('firstName');
  const lastNameField = fieldProps('lastName');
  const phoneField = fieldProps('phone');
  const passwordField = fieldProps('password', {
    onLastSubmit: () => {
      void onSubmit();
    },
  });

  return (
    <Screen title="Inscription" subtitle="Créez votre compte AfrikaTrans.">
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
            error={formState.errors.firstName?.message}
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
            error={formState.errors.lastName?.message}
            returnKeyType={lastNameField.returnKeyType}
            submitBehavior={lastNameField.submitBehavior}
            onSubmitEditing={lastNameField.onSubmitEditing}
          />
        )}
      />
      <Controller
        control={control}
        name="phone"
        render={({field: {onChange, value}}) => (
          <TextField
            ref={phoneField.ref}
            label="Téléphone"
            keyboardType="phone-pad"
            autoComplete="tel"
            value={value}
            onChangeText={onChange}
            error={formState.errors.phone?.message}
            returnKeyType={phoneField.returnKeyType}
            submitBehavior={phoneField.submitBehavior}
            accessoryActionLabel={phoneField.accessoryActionLabel}
            onSubmitEditing={phoneField.onSubmitEditing}
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
        label="Continuer"
        loading={formState.isSubmitting}
        onPress={onSubmit}
      />
    </Screen>
  );
}
