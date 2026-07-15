import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {AuthStackParamList} from '../../../navigation/types';
import {Screen} from '../../../components/ui/Screen';
import {TextField} from '../../../components/ui/TextField';
import {Button} from '../../../components/ui/Button';
import {AuthStepIndicator} from '../../../components/auth/AuthStepIndicator';
import {pinSchema} from '../../../schemas/forms';
import {authApi} from '../../../services/api';
import {unwrap} from '../../../services/api/helpers';
import {
  enableBiometricUnlock,
} from '../../../services/secureStorage';
import {useSessionStore} from '../../../stores/sessionStore';
import {useTheme} from '../../../theme/ThemeProvider';
import {usePreferencesStore} from '../../../stores/preferencesStore';
import {useRegisterDraftStore} from '../../../stores/registerDraftStore';
import {useInputFocusChain} from '../../../hooks/useInputFocusChain';
import {z} from 'zod';

type Props = NativeStackScreenProps<AuthStackParamList, 'ConfirmPin'>;
type FormValues = z.infer<typeof pinSchema>;

export function ConfirmPinScreen({route}: Props) {
  const theme = useTheme();
  const setSession = useSessionStore(s => s.setSession);
  const refreshLocalAuth = useSessionStore(s => s.refreshLocalAuth);
  const setBiometricEnabled = usePreferencesStore(s => s.setBiometricEnabled);
  const draft = useRegisterDraftStore();
  const clearDraft = useRegisterDraftStore(s => s.clear);
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
      const phone = route.params.phone || draft.phone;
      const password = draft.password || 'Demo1234!';
      const login = unwrap(
        await authApi.login({
          phone,
          password,
        }),
      );

      let biometricOn = false;
      if (enableBiometric) {
        biometricOn = await enableBiometricUnlock();
      }
      setBiometricEnabled(biometricOn);

      await setSession(
        {...login.user, hasPin: true, biometricEnabled: biometricOn},
        login.tokens,
      );
      await refreshLocalAuth();
      clearDraft();
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
    <Screen
      title="Confirmez le PIN"
      subtitle="Saisissez à nouveau le même code.">
      <AuthStepIndicator step={6} total={6} label="Confirmation" />
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            borderRadius: theme.radius.xl,
          },
        ]}>
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
              onChangeText={text => onChange(text.replace(/\D/g, '').slice(0, 6))}
              error={formState.errors.pin?.message}
              returnKeyType={pinField.returnKeyType}
              submitBehavior={pinField.submitBehavior}
              accessoryActionLabel={pinField.accessoryActionLabel}
              onSubmitEditing={pinField.onSubmitEditing}
              style={styles.pinInput}
            />
          )}
        />
      </View>
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
        label="Activer aussi la biométrie"
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

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
  },
  pinInput: {
    letterSpacing: 10,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
});
