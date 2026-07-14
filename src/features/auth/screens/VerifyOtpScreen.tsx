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
import {otpSchema} from '../../../schemas/forms';
import {authApi} from '../../../services/api';
import {unwrap} from '../../../services/api/helpers';
import {useTheme} from '../../../theme/ThemeProvider';
import {useInputFocusChain} from '../../../hooks/useInputFocusChain';
import {z} from 'zod';

type Props = NativeStackScreenProps<AuthStackParamList, 'VerifyOtp'>;
type FormValues = z.infer<typeof otpSchema>;

export function VerifyOtpScreen({navigation, route}: Props) {
  const theme = useTheme();
  const [error, setError] = useState<string | null>(null);
  const {control, handleSubmit, formState} = useForm<FormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {code: ''},
  });
  const {fieldProps} = useInputFocusChain(['code'] as const);

  const onSubmit = handleSubmit(async values => {
    setError(null);
    try {
      unwrap(
        await authApi.verifyOtp({phone: route.params.phone, code: values.code}),
      );
      navigation.navigate('CreatePin', {phone: route.params.phone});
    } catch (e) {
      setError(e instanceof Error ? e.message : 'OTP invalide');
    }
  });

  const codeField = fieldProps('code', {
    onLastSubmit: () => {
      void onSubmit();
    },
  });

  return (
    <Screen
      title="Vérifiez votre numéro"
      subtitle={`Un code à 6 chiffres a été envoyé au ${route.params.phone}.`}>
      <AuthStepIndicator step={4} total={6} label="Vérification" />
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
          name="code"
          render={({field: {onChange, value}}) => (
            <TextField
              ref={codeField.ref}
              label="Code OTP"
              keyboardType="number-pad"
              maxLength={6}
              value={value}
              onChangeText={text => onChange(text.replace(/\D/g, '').slice(0, 6))}
              error={formState.errors.code?.message}
              returnKeyType={codeField.returnKeyType}
              submitBehavior={codeField.submitBehavior}
              accessoryActionLabel={codeField.accessoryActionLabel}
              onSubmitEditing={codeField.onSubmitEditing}
              style={styles.otpInput}
            />
          )}
        />
        <Text
          style={{
            color: theme.colors.textMuted,
            fontSize: theme.typography.caption,
            marginTop: -8,
          }}>
          Démo : 123456
        </Text>
      </View>
      {error ? (
        <Text style={{color: theme.colors.error, marginBottom: 12}}>
          {error}
        </Text>
      ) : null}
      <Button
        label="Vérifier"
        loading={formState.isSubmitting}
        onPress={onSubmit}
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
  otpInput: {
    letterSpacing: 8,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
});
