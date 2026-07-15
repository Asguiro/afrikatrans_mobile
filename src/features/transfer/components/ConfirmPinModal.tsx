import React, {useEffect, useState} from 'react';
import {
  Keyboard,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {useTheme} from '../../../theme/ThemeProvider';
import {Button} from '../../../components/ui/Button';
import {TextField} from '../../../components/ui/TextField';
import {pinSchema} from '../../../schemas/forms';
import {useInputFocusChain} from '../../../hooks/useInputFocusChain';

type Props = {
  visible: boolean;
  loading?: boolean;
  error?: string | null;
  onClose: () => void;
  onConfirm: (pin: string) => void | Promise<void>;
};

/**
 * Popup de confirmation PIN.
 * Remonte explicitement avec la hauteur clavier (KAV peu fiable dans Modal).
 */
export function ConfirmPinModal({
  visible,
  loading = false,
  error = null,
  onClose,
  onConfirm,
}: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [localError, setLocalError] = useState<string | null>(null);
  const {control, handleSubmit, formState, reset} = useForm<
    z.infer<typeof pinSchema>
  >({
    resolver: zodResolver(pinSchema),
    defaultValues: {pin: ''},
  });
  const {fieldProps} = useInputFocusChain(['pin'] as const);

  useEffect(() => {
    if (visible) {
      reset({pin: ''});
      setLocalError(null);
      setKeyboardHeight(0);
    }
  }, [visible, reset]);

  useEffect(() => {
    setLocalError(error);
  }, [error]);

  useEffect(() => {
    if (!visible) {
      return;
    }
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, event => {
      setKeyboardHeight(event.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [visible]);

  const submit = handleSubmit(async values => {
    setLocalError(null);
    await onConfirm(values.pin);
  });

  const pinField = fieldProps('pin', {
    onLastSubmit: () => {
      void submit();
    },
  });

  const bottomOffset =
    keyboardHeight > 0
      ? keyboardHeight + theme.spacing.sm
      : Math.max(insets.bottom, 16) + theme.spacing.md;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent>
      <View style={styles.root}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Fermer"
          style={[styles.backdrop, {backgroundColor: 'rgba(10, 22, 48, 0.55)'}]}
          onPress={loading ? undefined : onClose}
        />
        <View
          pointerEvents="box-none"
          style={[styles.sheetWrap, {paddingBottom: bottomOffset}]}>
          <View
            style={[
              styles.sheet,
              {
                backgroundColor: theme.colors.surface,
                borderRadius: theme.radius.xl,
                borderColor: theme.colors.border,
              },
            ]}>
            <View
              style={[styles.handle, {backgroundColor: theme.colors.border}]}
            />
            <Text
              accessibilityRole="header"
              style={{
                color: theme.colors.textPrimary,
                fontWeight: '800',
                fontSize: theme.typography.h3,
                textAlign: 'center',
              }}>
              Confirmer l’envoi
            </Text>
            <Text
              style={{
                color: theme.colors.textSecondary,
                fontSize: theme.typography.bodySmall,
                textAlign: 'center',
                marginTop: theme.spacing.sm,
                marginBottom: theme.spacing.xl,
                lineHeight: 20,
              }}>
              Saisissez votre PIN pour valider le transfert.
            </Text>

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

            {localError ? (
              <Text
                style={{
                  color: theme.colors.error,
                  marginBottom: theme.spacing.md,
                  textAlign: 'center',
                }}>
                {localError}
              </Text>
            ) : null}

            <Button label="Envoyer" loading={loading} onPress={submit} />
            <Button
              label="Annuler"
              variant="ghost"
              disabled={loading}
              onPress={onClose}
              style={{marginTop: 4}}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  sheetWrap: {
    paddingHorizontal: 16,
  },
  sheet: {
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 24,
    shadowOffset: {width: 0, height: 8},
    elevation: 8,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    marginBottom: 16,
  },
});
