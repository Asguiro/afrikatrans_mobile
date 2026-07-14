import React from 'react';
import {
  Image,
  ImageStyle,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import {logos} from '../../assets';
import {useTheme} from '../../theme/ThemeProvider';

type Variant = 'icon' | 'horizontal' | 'wordmark';

type Props = {
  variant?: Variant;
  /** Hauteur de référence (px). Pour `horizontal` / `wordmark`, la largeur suit le ratio du PNG. */
  size?: number;
  showTagline?: boolean;
  style?: StyleProp<ImageStyle>;
  /**
   * `plain` = logo transparent sur le fond parent (défaut) — adapté aux PNG light/dark.
   * `badge` = pastille surface pour contextes denses (listes, cards).
   * `light` = fond clair forcé (utile pour `logo-horizontal.png`, fond blanc intégré).
   */
  plate?: 'badge' | 'plain' | 'light';
  plateStyle?: StyleProp<ViewStyle>;
};

/** Ratio natif de `logo-horizontal.png` (2172×724). */
const HORIZONTAL_ASPECT = 2172 / 724;

/**
 * Marque AfrikaTrans — PNG uniquement via ce composant.
 * Sources : `logo_light` / `logo_dark` (picto) · `logo-horizontal` (wordmark).
 */
export function BrandLogo({
  variant = 'icon',
  size = 72,
  showTagline = false,
  style,
  plate = 'plain',
  plateStyle,
}: Props) {
  const theme = useTheme();
  const isWide = variant === 'horizontal' || variant === 'wordmark';
  const source = isWide
    ? logos.horizontal
    : theme.isDark
      ? logos.dark
      : logos.light;

  const height = size;
  const width = isWide ? Math.round(size * HORIZONTAL_ASPECT) : size;

  // Le PNG horizontal embarque un fond blanc + tagline → pastille claire en dark.
  const resolvedPlate =
    plate === 'plain' && isWide && theme.isDark ? 'light' : plate;

  const radius = Math.max(10, Math.round(Math.min(width, height) * 0.18));
  const pad = resolvedPlate === 'plain' ? 0 : Math.max(6, Math.round(height * 0.1));

  const image = (
    <Image
      source={source}
      style={[{width, height}, style]}
      resizeMode="contain"
      accessibilityIgnoresInvertColors
    />
  );

  const plateBg =
    resolvedPlate === 'light'
      ? '#FFFFFF'
      : resolvedPlate === 'badge'
        ? theme.colors.surface
        : undefined;

  // Tagline déjà dans le PNG horizontal — ne pas la dupliquer.
  const taglineVisible = showTagline && !isWide;

  return (
    <View style={styles.center} accessible accessibilityLabel="AfrikaTrans">
      {resolvedPlate === 'plain' ? (
        image
      ) : (
        <View
          style={[
            styles.plate,
            {
              padding: pad,
              borderRadius: radius,
              backgroundColor: plateBg,
              borderColor:
                resolvedPlate === 'light'
                  ? 'rgba(10, 46, 99, 0.08)'
                  : theme.colors.border,
            },
            plateStyle,
          ]}>
          {image}
        </View>
      )}
      {taglineVisible ? (
        <Text
          style={{
            marginTop: theme.spacing.sm,
            color: theme.colors.textSecondary,
            fontSize: theme.typography.bodySmall,
            textAlign: 'center',
          }}>
          Au-delà des frontières
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {alignItems: 'center'},
  plate: {
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
