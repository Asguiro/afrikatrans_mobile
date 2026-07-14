import React, {useState} from 'react';
import {Text} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {AuthStackParamList} from '../../../navigation/types';
import {Screen} from '../../../components/ui/Screen';
import {TextField} from '../../../components/ui/TextField';
import {Button} from '../../../components/ui/Button';
import {pinSchema} from '../../../schemas/forms';
import {authApi} from '../../../services/api';
import {unwrap} from '../../../services/api/helpers';
import {useSessionStore} from '../../../stores/sessionStore';
import {useTheme} from '../../../theme/ThemeProvider';
import {usePreferencesStore} from '../../../stores/preferencesStore';
import {useInputFocusChain} from '../../../hooks/useInputFocusChain';
import {z} from 'zod';

type Props = NativeStackScreenProps<AuthStackParamList, 'ConfirmPin'>;
type FormValues = z.infer<typeof pinSchema>;

export function ConfirmPinScreen({route}: Props) {
  const theme = useTheme();
  const setSession = useSessionStore(s => s.setSession);
  const setBiometricEnabled = usePreferencesStore(s => s.setBiometricEnabled);
  const [error, setError] = useState<string | null>(null);
  const {control, handleSubmit, formState} = useForm<FormValues>({
    resolver: zodResolver(pinSchema),
    defaultValues: {pin: ''},
  });
  const {fieldProps} = useInputFocusChain(['pin'] as const);

  const finish = async (enableBiometric: boolean) => {
    setError(null);
    try {
      unwrap(await authApi.setPin(route.params.pin));
      const login = unwrap(
        await authApi.login({
          phone: '+221771234567',
          password: 'Demo1234!',
        }),
      );
      setBiometricEnabled(enableBiometric);
      await setSession(
        {...login.user, hasPin: true, biometricEnabled: enableBiometric},
        login.tokens,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Impossible de finaliser');
    }
  };

  const onSubmit = handleSubmit(async values => {
    if (values.pin !== route.params.pin) {
      setError('Les PIN ne correspondent pas');
      return;
    }
    await finish(false);
  });

  const pinField = fieldProps('pin', {
    onLastSubmit: () => {
      void onSubmit();
    },
  });

  return (
    <Screen title="Confirmer le PIN" subtitle="Saisissez à nouveau votre PIN.">
      <Controller
        control={control}
        name="pin"
        render={({field: {onChange, value}}) => (
          <TextField
            ref={pinField.ref}
            label="Confirmation PIN"
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
        <Text style={{color: theme.colors.error, marginBottom: 12}}>
          {error}
        </Text>
      ) : null}
      <Button
        label="Activer et continuer"
        loading={formState.isSubmitting}
        onPress={onSubmit}
      />
      <Button
        label="Activer la biométrie aussi"
        variant="secondary"
        onPress={async () => {
          if (route.params.pin) {
            await finish(true);
          }
        }}
        style={{marginTop: 12}}
      />
    </Screen>
  );
}
