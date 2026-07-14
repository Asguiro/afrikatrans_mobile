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
  size?: number;
  showTagline?: boolean;
  style?: StyleProp<ImageStyle>;
  /**
   * `plain` = logo transparent sur le fond parent (défaut).
   * `badge` = pastille surface pour contextes denses (listes, cards).
   */
  plate?: 'badge' | 'plain';
  plateStyle?: StyleProp<ViewStyle>;
};

const VARIANT_SCALE: Record<Variant, number> = {
  icon: 1,
  horizontal: 1.35,
  wordmark: 1.5,
};

/**
 * Marque AfrikaTrans — utilise `logo_light` / `logo_dark` selon le thème.
 * Ne jamais utiliser `app-icon.png` dans l’UI.
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
  const source = theme.isDark ? logos.dark : logos.light;
  const side = size * VARIANT_SCALE[variant];
  const radius = Math.max(10, Math.round(side * 0.22));

  const image = (
    <Image
      source={source}
      style={[{width: side, height: side, resizeMode: 'contain'}, style]}
      accessibilityIgnoresInvertColors
    />
  );

  return (
    <View style={styles.center} accessible accessibilityLabel="AfrikaTrans">
      {plate === 'badge' ? (
        <View
          style={[
            styles.plate,
            {
              width: side + 12,
              height: side + 12,
              borderRadius: radius,
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
            plateStyle,
          ]}>
          {image}
        </View>
      ) : (
        image
      )}
      {showTagline ? (
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
