import React, {useMemo, useState} from 'react';
import {Alert, Pressable, Text, View} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Camera} from 'lucide-react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {z} from 'zod';
import type {AppStackParamList} from '../../../navigation/types';
import {Screen} from '../../../components/ui/Screen';
import {TextField} from '../../../components/ui/TextField';
import {Button} from '../../../components/ui/Button';
import {Avatar} from '../../../components/ui/ListRow';
import {updateProfileSchema} from '../../../schemas/forms';
import {useUpdateMeMutation, useCountriesQuery} from '../../../hooks/queries';
import {useSessionStore} from '../../../stores/sessionStore';
import {useAppPermissions} from '../../../hooks/useAppPermissions';
import {withAppLockSuppressed} from '../../../stores/appLockGateStore';
import {useProfileDraftStore} from '../../../stores/profileDraftStore';
import {useTheme} from '../../../theme/ThemeProvider';
import {useInputFocusChain} from '../../../hooks/useInputFocusChain';
import {ApiError} from '../../../types/api';

type Props = NativeStackScreenProps<AppStackParamList, 'EditProfile'>;
type FormValues = z.infer<typeof updateProfileSchema>;

export function EditProfileScreen({navigation}: Props) {
  const theme = useTheme();
  const user = useSessionStore(s => s.user);
  const mutation = useUpdateMeMutation();
  const {data: countries} = useCountriesQuery();
  const pendingAvatarUri = useProfileDraftStore(s => s.pendingAvatarUri);
  const setPendingAvatarUri = useProfileDraftStore(s => s.setPendingAvatarUri);
  const clearPendingAvatar = useProfileDraftStore(s => s.clearPendingAvatar);
  const avatarUri = pendingAvatarUri ?? user?.avatarUrl ?? null;
  const [formError, setFormError] = useState<string | null>(null);
  const {ensure} = useAppPermissions();

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ');
  const countryName =
    countries?.find(c => c.code === user?.countryCode)?.name ??
    user?.countryCode ??
    '—';

  const defaults = useMemo<FormValues>(
    () => ({
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      email: user?.email ?? '',
    }),
    [user],
  );

  const {control, handleSubmit, formState} = useForm<FormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: defaults,
    values: defaults,
  });

  const {fieldProps} = useInputFocusChain([
    'firstName',
    'lastName',
    'email',
  ] as const);

  const pickPhoto = async () => {
    const allowed = await ensure('photoLibrary');
    if (!allowed) {
      return;
    }
    try {
      await withAppLockSuppressed(async () => {
        const response = await launchImageLibrary({
          mediaType: 'photo',
          quality: 0.8,
          maxWidth: 1024,
          maxHeight: 1024,
          selectionLimit: 1,
        });

        if (response.didCancel) {
          return;
        }
        if (response.errorCode) {
          Alert.alert(
            'Photo',
            response.errorMessage ?? 'Impossible de choisir une photo',
          );
          return;
        }
        const uri = response.assets?.[0]?.uri;
        if (uri) {
          setPendingAvatarUri(uri);
        }
      });
    } catch {
      Alert.alert(
        'Photo indisponible',
        'Impossible d’ouvrir la galerie pour le moment.',
      );
    }
  };

  const onSubmit = handleSubmit(async values => {
    setFormError(null);
    try {
      await mutation.mutateAsync({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email?.trim() ? values.email.trim() : null,
        avatarUrl: avatarUri,
      });
      clearPendingAvatar();
      Alert.alert('Profil mis à jour', 'Vos informations ont été enregistrées.');
      navigation.goBack();
    } catch (e) {
      const message =
        e instanceof ApiError
          ? e.message
          : e instanceof Error
            ? e.message
            : 'Enregistrement impossible';
      setFormError(message);
    }
  });

  const firstNameField = fieldProps('firstName');
  const lastNameField = fieldProps('lastName');
  const emailField = fieldProps('email', {
    onLastSubmit: () => {
      void onSubmit();
    },
  });

  return (
    <Screen
      title="Informations"
      subtitle="Mettez à jour votre identité et votre photo.">
      <View style={{alignItems: 'center', marginBottom: theme.spacing['2xl']}}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Modifier la photo de profil"
          hitSlop={12}
          onPress={() => {
            void pickPhoto();
          }}
          style={{alignItems: 'center', minHeight: 44, minWidth: 44}}>
          <View>
            <Avatar name={fullName || 'AT'} size={96} imageUri={avatarUri} />
            <View
              style={{
                position: 'absolute',
                right: 0,
                bottom: 0,
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: theme.colors.brandPrimary,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 2,
                borderColor: theme.colors.background,
              }}>
              <Camera
                color={theme.colors.onBrandPrimary}
                size={16}
                strokeWidth={2.5}
              />
            </View>
          </View>
          <Text
            style={{
              color: theme.colors.brandPrimary,
              fontWeight: '600',
              marginTop: theme.spacing.md,
              fontSize: theme.typography.bodySmall,
            }}>
            Changer la photo
          </Text>
        </Pressable>
      </View>

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
        name="email"
        render={({field: {onChange, value}}) => (
          <TextField
            ref={emailField.ref}
            label="E-mail"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={value ?? ''}
            onChangeText={onChange}
            error={formState.errors.email?.message}
            returnKeyType={emailField.returnKeyType}
            submitBehavior={emailField.submitBehavior}
            onSubmitEditing={emailField.onSubmitEditing}
          />
        )}
      />

      <TextField
        label="Téléphone"
        value={user?.phone ?? ''}
        editable={false}
        accessibilityHint="Le téléphone ne peut pas être modifié ici"
      />
      <Text
        style={{
          color: theme.colors.textMuted,
          fontSize: theme.typography.caption,
          marginTop: -10,
          marginBottom: theme.spacing.lg,
        }}>
        Le changement de numéro nécessite une vérification OTP.
      </Text>

      <TextField label="Pays" value={countryName} editable={false} />

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
        label="Enregistrer"
        onPress={() => {
          void onSubmit();
        }}
        loading={mutation.isPending}
      />
    </Screen>
  );
}
