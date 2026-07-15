import React, {useState} from 'react';
import {Alert, Text} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {z} from 'zod';
import type {AppStackParamList} from '../../../navigation/types';
import {Screen} from '../../../components/ui/Screen';
import {TextField} from '../../../components/ui/TextField';
import {Button} from '../../../components/ui/Button';
import {changePinSchema} from '../../../schemas/forms';
import {useChangePinMutation} from '../../../hooks/queries';
import {useSessionStore} from '../../../stores/sessionStore';
import {useTheme} from '../../../theme/ThemeProvider';
import {useInputFocusChain} from '../../../hooks/useInputFocusChain';
import {ApiError} from '../../../types/api';

type Props = NativeStackScreenProps<AppStackParamList, 'ChangePin'>;
type FormValues = z.infer<typeof changePinSchema>;

export function ChangePinScreen({navigation}: Props) {
  const theme = useTheme();
  const mutation = useChangePinMutation();
  const refreshLocalAuth = useSessionStore(s => s.refreshLocalAuth);
  const [formError, setFormError] = useState<string | null>(null);

  const {control, handleSubmit, formState, reset} = useForm<FormValues>({
    resolver: zodResolver(changePinSchema),
    defaultValues: {
      currentPin: '',
      newPin: '',
      confirmPin: '',
    },
  });

  const {fieldProps} = useInputFocusChain([
    'currentPin',
    'newPin',
    'confirmPin',
  ] as const);

  const onSubmit = handleSubmit(async values => {
    setFormError(null);
    try {
      await mutation.mutateAsync({
        currentPin: values.currentPin,
        newPin: values.newPin,
      });
      await refreshLocalAuth();
      reset();
      Alert.alert(
        'PIN mis à jour',
        'Le nouveau PIN sera demandé au déverrouillage et pour confirmer un transfert.',
        [{text: 'OK', onPress: () => navigation.goBack()}],
      );
    } catch (e) {
      const message =
        e instanceof ApiError
          ? e.message
          : e instanceof Error
            ? e.message
            : 'Modification impossible';
      setFormError(message);
    }
  });

  const currentField = fieldProps('currentPin');
  const newField = fieldProps('newPin');
  const confirmField = fieldProps('confirmPin', {
    onLastSubmit: () => {
      void onSubmit();
    },
  });

  return (
    <Screen
      title="Code PIN"
      subtitle="Le PIN est stocké dans le Keychain / Keystore de l’appareil.">
      <Controller
        control={control}
        name="currentPin"
        render={({field: {onChange, value}}) => (
          <TextField
            ref={currentField.ref}
            label="PIN actuel"
            secureTextEntry
            keyboardType="number-pad"
            maxLength={6}
            value={value}
            onChangeText={text => onChange(text.replace(/\D/g, '').slice(0, 6))}
            error={formState.errors.currentPin?.message}
            returnKeyType={currentField.returnKeyType}
            submitBehavior={currentField.submitBehavior}
            onSubmitEditing={currentField.onSubmitEditing}
            accessoryActionLabel={currentField.accessoryActionLabel}
          />
        )}
      />
      <Controller
        control={control}
        name="newPin"
        render={({field: {onChange, value}}) => (
          <TextField
            ref={newField.ref}
            label="Nouveau PIN"
            secureTextEntry
            keyboardType="number-pad"
            maxLength={6}
            value={value}
            onChangeText={text => onChange(text.replace(/\D/g, '').slice(0, 6))}
            error={formState.errors.newPin?.message}
            returnKeyType={newField.returnKeyType}
            submitBehavior={newField.submitBehavior}
            onSubmitEditing={newField.onSubmitEditing}
            accessoryActionLabel={newField.accessoryActionLabel}
          />
        )}
      />
      <Controller
        control={control}
        name="confirmPin"
        render={({field: {onChange, value}}) => (
          <TextField
            ref={confirmField.ref}
            label="Confirmer le PIN"
            secureTextEntry
            keyboardType="number-pad"
            maxLength={6}
            value={value}
            onChangeText={text => onChange(text.replace(/\D/g, '').slice(0, 6))}
            error={formState.errors.confirmPin?.message}
            returnKeyType={confirmField.returnKeyType}
            submitBehavior={confirmField.submitBehavior}
            onSubmitEditing={confirmField.onSubmitEditing}
            accessoryActionLabel={confirmField.accessoryActionLabel}
          />
        )}
      />

      {formError ? (
        <Text
          accessibilityLiveRegion="polite"
          style={{
            color: theme.colors.error,
            marginBottom: theme.spacing.md,
            fontSize: theme.typography.bodySmall,
          }}>
          {formError}
        </Text>
      ) : null}

      <Button
        label="Mettre à jour le PIN"
        onPress={() => {
          void onSubmit();
        }}
        loading={mutation.isPending}
      />
    </Screen>
  );
}
