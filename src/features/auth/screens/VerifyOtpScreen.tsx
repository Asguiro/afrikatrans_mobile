import React, {useState} from 'react';
import {Text} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {AuthStackParamList} from '../../../navigation/types';
import {Screen} from '../../../components/ui/Screen';
import {TextField} from '../../../components/ui/TextField';
import {Button} from '../../../components/ui/Button';
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
      navigation.navigate('CreatePin');
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
      title="Vérification OTP"
      subtitle={`Code envoyé au ${route.params.phone}. Démo : 123456`}>
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
            onChangeText={onChange}
            error={formState.errors.code?.message}
            returnKeyType={codeField.returnKeyType}
            submitBehavior={codeField.submitBehavior}
            accessoryActionLabel={codeField.accessoryActionLabel}
            onSubmitEditing={codeField.onSubmitEditing}
          />
        )}
      />
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
