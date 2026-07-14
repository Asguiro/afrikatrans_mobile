import React, {forwardRef, useId} from 'react';
import {
  InputAccessoryView,
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import {useTheme} from '../../theme/ThemeProvider';

type Props = TextInputProps & {
  label?: string;
  error?: string;
  /** Libellé du bouton accessoire iOS (pads sans touche Retour). */
  accessoryActionLabel?: string;
};

function isPadKeyboard(
  keyboardType: TextInputProps['keyboardType'] | undefined,
): boolean {
  return (
    keyboardType === 'number-pad' ||
    keyboardType === 'phone-pad' ||
    keyboardType === 'decimal-pad' ||
    keyboardType === 'numeric'
  );
}

export const TextField = forwardRef<TextInput, Props>(function TextField(
  {
    label,
    error,
    style,
    accessoryActionLabel,
    onSubmitEditing,
    returnKeyType,
    submitBehavior,
    keyboardType,
    ...props
  },
  ref,
) {
  const theme = useTheme();
  const accessoryId = useId();
  const needsAccessory =
    Platform.OS === 'ios' &&
    isPadKeyboard(keyboardType) &&
    Boolean(onSubmitEditing);

  const actionLabel = accessoryActionLabel ?? (returnKeyType === 'next' ? 'Suivant' : 'OK');

  return (
    <View style={[styles.wrap, !label ? styles.wrapFlush : null]}>
      {label ? (
        <Text
          style={{
            color: theme.colors.textSecondary,
            marginBottom: theme.spacing.sm,
            fontSize: theme.typography.bodySmall,
          }}>
          {label}
        </Text>
      ) : null}
      <TextInput
        ref={ref}
        placeholderTextColor={theme.colors.textMuted}
        accessibilityLabel={label ?? props.accessibilityLabel}
        keyboardType={keyboardType}
        returnKeyType={returnKeyType}
        submitBehavior={submitBehavior}
        onSubmitEditing={onSubmitEditing}
        inputAccessoryViewID={needsAccessory ? accessoryId : undefined}
        style={[
          styles.input,
          {
            color: theme.colors.textPrimary,
            backgroundColor: theme.colors.surface,
            borderColor: error ? theme.colors.error : theme.colors.border,
            borderRadius: theme.radius.md,
            minHeight: theme.controlHeights.large,
            fontSize: theme.typography.body,
          },
          style,
        ]}
        {...props}
      />
      {error ? (
        <Text
          accessibilityLiveRegion="polite"
          style={{
            color: theme.colors.error,
            marginTop: theme.spacing.xs,
            fontSize: theme.typography.caption,
          }}>
          {error}
        </Text>
      ) : null}
      {needsAccessory ? (
        <InputAccessoryView nativeID={accessoryId}>
          <View
            style={[
              styles.accessory,
              {
                backgroundColor: theme.colors.surfaceRaised,
                borderTopColor: theme.colors.border,
              },
            ]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={actionLabel}
              hitSlop={8}
              onPress={() => {
                if (onSubmitEditing) {
                  // same action que la touche Retour (pads iOS n’en ont pas)
                  (onSubmitEditing as () => void)();
                } else {
                  Keyboard.dismiss();
                }
              }}
              style={styles.accessoryBtn}>
              <Text
                style={{
                  color: theme.colors.brandPrimary,
                  fontWeight: '700',
                  fontSize: theme.typography.body,
                }}>
                {actionLabel}
              </Text>
            </Pressable>
          </View>
        </InputAccessoryView>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {marginBottom: 16},
  wrapFlush: {marginBottom: 0},
  input: {
    borderWidth: 1,
    paddingHorizontal: 14,
  },
  accessory: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'flex-end',
  },
  accessoryBtn: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
});
