import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {useTheme} from '../../theme/ThemeProvider';
import {Button} from '../ui/Button';

export function LoadingState({label = 'Chargement…'}: {label?: string}) {
  const theme = useTheme();
  return (
    <View style={styles.center} accessibilityRole="progressbar">
      <ActivityIndicator color={theme.colors.brandPrimary} size="large" />
      <Text style={{color: theme.colors.textSecondary, marginTop: 12}}>
        {label}
      </Text>
    </View>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  const theme = useTheme();
  return (
    <View style={styles.center}>
      <Text
        style={{
          color: theme.colors.error,
          textAlign: 'center',
          marginBottom: 16,
          fontSize: theme.typography.body,
        }}>
        {message}
      </Text>
      {onRetry ? <Button label="Réessayer" onPress={onRetry} /> : null}
    </View>
  );
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const theme = useTheme();
  return (
    <View style={styles.center}>
      <Text
        style={{
          color: theme.colors.textPrimary,
          fontSize: theme.typography.h4,
          fontWeight: '600',
          marginBottom: 8,
          textAlign: 'center',
        }}>
        {title}
      </Text>
      {description ? (
        <Text
          style={{
            color: theme.colors.textSecondary,
            textAlign: 'center',
            marginBottom: 16,
          }}>
          {description}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
});
