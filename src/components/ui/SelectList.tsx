import React from 'react';
import {Pressable, Text, View} from 'react-native';
import {useTheme} from '../../theme/ThemeProvider';

type Option = {
  id: string;
  title: string;
  subtitle?: string;
  disabled?: boolean;
};

type Props = {
  options: Option[];
  onSelect: (id: string) => void;
};

export function SelectList({options, onSelect}: Props) {
  const theme = useTheme();
  return (
    <View>
      {options.map(option => (
        <Pressable
          key={option.id}
          accessibilityRole="button"
          accessibilityState={{disabled: option.disabled}}
          disabled={option.disabled}
          onPress={() => onSelect(option.id)}
          style={({pressed}) => ({
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            borderWidth: 1,
            borderRadius: theme.radius.md,
            padding: theme.spacing.lg,
            marginBottom: theme.spacing.md,
            opacity: option.disabled ? 0.45 : pressed ? 0.85 : 1,
            minHeight: 52,
          })}>
          <Text
            style={{
              color: theme.colors.textPrimary,
              fontWeight: '600',
              fontSize: theme.typography.body,
            }}>
            {option.title}
          </Text>
          {option.subtitle ? (
            <Text
              style={{
                color: theme.colors.textSecondary,
                marginTop: 4,
                fontSize: theme.typography.bodySmall,
              }}>
              {option.subtitle}
            </Text>
          ) : null}
        </Pressable>
      ))}
    </View>
  );
}
