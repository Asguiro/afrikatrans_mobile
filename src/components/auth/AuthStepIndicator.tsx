import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useTheme} from '../../theme/ThemeProvider';

type Props = {
  /** Étape courante (1-indexée). */
  step: number;
  /** Nombre total d’étapes du parcours. */
  total: number;
  /** Libellé court de l’étape (ex. « Téléphone »). */
  label?: string;
};

/**
 * Indicateur de progression pour l’onboarding auth.
 * Une seule ligne claire — pas de clutter.
 */
export function AuthStepIndicator({step, total, label}: Props) {
  const theme = useTheme();
  const clamped = Math.min(Math.max(step, 1), total);

  return (
    <View
      style={styles.wrap}
      accessibilityRole="progressbar"
      accessibilityValue={{min: 1, max: total, now: clamped}}
      accessibilityLabel={`Étape ${clamped} sur ${total}${
        label ? ` · ${label}` : ''
      }`}>
      <View style={styles.row}>
        {Array.from({length: total}, (_, i) => {
          const index = i + 1;
          const done = index < clamped;
          const active = index === clamped;
          return (
            <View
              key={index}
              style={[
                styles.segment,
                {
                  backgroundColor: done || active
                    ? theme.colors.brandPrimary
                    : theme.colors.border,
                  opacity: active ? 1 : done ? 0.85 : 1,
                  flex: active ? 1.4 : 1,
                },
              ]}
            />
          );
        })}
      </View>
      <Text
        style={{
          marginTop: theme.spacing.sm,
          color: theme.colors.textMuted,
          fontSize: theme.typography.caption,
          fontWeight: '600',
          letterSpacing: 0.2,
        }}>
        Étape {clamped}/{total}
        {label ? ` · ${label}` : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {marginBottom: 20},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  segment: {
    height: 4,
    borderRadius: 2,
  },
});
