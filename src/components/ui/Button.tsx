import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import {useTheme} from '../../theme/ThemeProvider';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  accessibilityHint?: string;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  accessibilityHint,
}: Props) {
  const theme = useTheme();
  const isDisabled = disabled || loading;

  const backgroundColor =
    variant === 'primary'
      ? theme.colors.brandPrimary
      : variant === 'secondary'
        ? theme.colors.brandAccent
        : variant === 'danger'
          ? theme.colors.error
          : 'transparent';

  const textColor =
    variant === 'ghost'
      ? theme.colors.brandPrimary
      : variant === 'secondary'
        ? theme.colors.textPrimary
        : variant === 'danger'
          ? theme.colors.onError
          : theme.colors.onBrandPrimary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{disabled: isDisabled, busy: loading}}
      onPress={onPress}
      disabled={isDisabled}
      style={({pressed}) => [
        styles.base,
        {
          backgroundColor,
          borderColor: theme.colors.border,
          minHeight: theme.controlHeights.large,
          borderRadius: theme.radius.md,
          opacity: isDisabled ? 0.5 : pressed ? 0.85 : 1,
          borderWidth: variant === 'ghost' ? 1 : 0,
        },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.label, {color: textColor, fontSize: theme.typography.body}]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  label: {
    fontWeight: '600',
  },
});
