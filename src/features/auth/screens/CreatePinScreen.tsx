import React from 'react';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {AuthStackParamList} from '../../../navigation/types';
import {Screen} from '../../../components/ui/Screen';
import {TextField} from '../../../components/ui/TextField';
import {Button} from '../../../components/ui/Button';
import {pinSchema} from '../../../schemas/forms';
import {useInputFocusChain} from '../../../hooks/useInputFocusChain';
import {z} from 'zod';

type Props = NativeStackScreenProps<AuthStackParamList, 'CreatePin'>;
type FormValues = z.infer<typeof pinSchema>;

export function CreatePinScreen({navigation}: Props) {
  const {control, handleSubmit, formState} = useForm<FormValues>({
    resolver: zodResolver(pinSchema),
    defaultValues: {pin: ''},
  });
  const {fieldProps} = useInputFocusChain(['pin'] as const);

  const onSubmit = handleSubmit(values => {
    navigation.navigate('ConfirmPin', {pin: values.pin});
  });

  const pinField = fieldProps('pin', {
    onLastSubmit: () => {
      void onSubmit();
    },
  });

  return (
    <Screen
      title="Créer un PIN"
      subtitle="Ce code sécurise vos transferts. Démo : 1234">
      <Controller
        control={control}
        name="pin"
        render={({field: {onChange, value}}) => (
          <TextField
            ref={pinField.ref}
            label="PIN"
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
      <Button label="Continuer" onPress={onSubmit} />
    </Screen>
  );
}
