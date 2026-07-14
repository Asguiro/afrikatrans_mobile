import React from 'react';
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
import {useTheme} from '../../../theme/ThemeProvider';
import {useInputFocusChain} from '../../../hooks/useInputFocusChain';
import {z} from 'zod';

type Props = NativeStackScreenProps<AuthStackParamList, 'CreatePin'>;
type FormValues = z.infer<typeof pinSchema>;

export function CreatePinScreen({navigation, route}: Props) {
  const theme = useTheme();
  const {control, handleSubmit, formState} = useForm<FormValues>({
    resolver: zodResolver(pinSchema),
    defaultValues: {pin: ''},
  });
  const {fieldProps} = useInputFocusChain(['pin'] as const);

  const onSubmit = handleSubmit(values => {
    navigation.navigate('ConfirmPin', {
      pin: values.pin,
      phone: route.params.phone,
    });
  });

  const pinField = fieldProps('pin', {
    onLastSubmit: () => {
      void onSubmit();
    },
  });

  return (
    <Screen
      title="Créez votre PIN"
      subtitle="Ce code sécurise l’ouverture de l’app et les transferts.">
      <AuthStepIndicator step={5} total={6} label="PIN" />
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
              label="PIN (4 à 6 chiffres)"
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
        <Text
          style={{
            color: theme.colors.textMuted,
            fontSize: theme.typography.caption,
          }}>
          Démo : 1234
        </Text>
      </View>
      <Button label="Continuer" onPress={onSubmit} />
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
