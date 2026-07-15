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
import {changePasswordSchema} from '../../../schemas/forms';
import {useChangePasswordMutation} from '../../../hooks/queries';
import {useTheme} from '../../../theme/ThemeProvider';
import {useInputFocusChain} from '../../../hooks/useInputFocusChain';
import {ApiError} from '../../../types/api';

type Props = NativeStackScreenProps<AppStackParamList, 'ChangePassword'>;
type FormValues = z.infer<typeof changePasswordSchema>;

export function ChangePasswordScreen({navigation}: Props) {
  const theme = useTheme();
  const mutation = useChangePasswordMutation();
  const [formError, setFormError] = useState<string | null>(null);

  const {control, handleSubmit, formState, reset} = useForm<FormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const {fieldProps} = useInputFocusChain([
    'currentPassword',
    'newPassword',
    'confirmPassword',
  ] as const);

  const onSubmit = handleSubmit(async values => {
    setFormError(null);
    try {
      await mutation.mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      reset();
      Alert.alert(
        'Mot de passe modifié',
        'Utilisez le nouveau mot de passe à la prochaine connexion.',
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

  const currentField = fieldProps('currentPassword');
  const newField = fieldProps('newPassword');
  const confirmField = fieldProps('confirmPassword', {
    onLastSubmit: () => {
      void onSubmit();
    },
  });

  return (
    <Screen
      title="Mot de passe"
      subtitle="Le mot de passe n’est jamais stocké en clair sur l’appareil.">
      <Controller
        control={control}
        name="currentPassword"
        render={({field: {onChange, value}}) => (
          <TextField
            ref={currentField.ref}
            label="Mot de passe actuel"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="password"
            value={value}
            onChangeText={onChange}
            error={formState.errors.currentPassword?.message}
            returnKeyType={currentField.returnKeyType}
            submitBehavior={currentField.submitBehavior}
            onSubmitEditing={currentField.onSubmitEditing}
          />
        )}
      />
      <Controller
        control={control}
        name="newPassword"
        render={({field: {onChange, value}}) => (
          <TextField
            ref={newField.ref}
            label="Nouveau mot de passe"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="newPassword"
            value={value}
            onChangeText={onChange}
            error={formState.errors.newPassword?.message}
            returnKeyType={newField.returnKeyType}
            submitBehavior={newField.submitBehavior}
            onSubmitEditing={newField.onSubmitEditing}
          />
        )}
      />
      <Controller
        control={control}
        name="confirmPassword"
        render={({field: {onChange, value}}) => (
          <TextField
            ref={confirmField.ref}
            label="Confirmer"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="newPassword"
            value={value}
            onChangeText={onChange}
            error={formState.errors.confirmPassword?.message}
            returnKeyType={confirmField.returnKeyType}
            submitBehavior={confirmField.submitBehavior}
            onSubmitEditing={confirmField.onSubmitEditing}
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
        label="Mettre à jour"
        onPress={() => {
          void onSubmit();
        }}
        loading={mutation.isPending}
      />
    </Screen>
  );
}
