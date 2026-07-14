import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useTheme} from '../../../theme/ThemeProvider';
import {
  OPERATOR_BRANDS,
  type OperatorBrand,
  type OperatorBrandCode,
} from '../constants/operatorBrands';

type GridProps = {
  selectedCode?: OperatorBrandCode | string;
  onSelect: (code: OperatorBrandCode) => void;
  disabledCodes?: string[];
};

type MarkProps = {
  brand: OperatorBrand;
  size?: number;
};

/** Logo opérateur sur fond adapté au PNG/WebP (souvent opaque). */
export function OperatorLogoMark({brand, size = 56}: MarkProps) {
  const theme = useTheme();
  const radius = Math.max(10, Math.round(size * 0.22));

  return (
    <View
      style={[
        styles.mark,
        {
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: brand.logoPlate,
          borderColor: theme.colors.border,
        },
      ]}>
      <Image
        source={brand.logo}
        style={{width: size * 0.86, height: size * 0.86}}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
      />
    </View>
  );
}

export function OperatorBrandGrid({
  selectedCode,
  onSelect,
  disabledCodes = [],
}: GridProps) {
  const theme = useTheme();

  return (
    <View style={styles.grid}>
      {OPERATOR_BRANDS.map(brand => {
        const disabled = disabledCodes.includes(brand.code);
        const selected = selectedCode === brand.code;
        return (
          <Pressable
            key={brand.code}
            accessibilityRole="button"
            accessibilityState={{selected, disabled}}
            accessibilityLabel={brand.name}
            disabled={disabled}
            onPress={() => onSelect(brand.code)}
            style={({pressed}) => [
              styles.card,
              {
                backgroundColor: theme.colors.surface,
                borderColor: selected
                  ? theme.colors.brandPrimary
                  : theme.colors.border,
                borderWidth: selected ? 2 : 1,
                borderRadius: theme.radius.lg,
                opacity: disabled ? 0.45 : pressed ? 0.9 : 1,
              },
            ]}>
            <OperatorLogoMark brand={brand} size={64} />
            <Text
              style={{
                color: theme.colors.textPrimary,
                fontWeight: '700',
                fontSize: theme.typography.body,
                textAlign: 'center',
                marginTop: 12,
              }}>
              {brand.name}
            </Text>
            {disabled ? (
              <Text
                style={{
                  color: theme.colors.warning,
                  fontSize: theme.typography.caption,
                  marginTop: 4,
                }}>
                Indisponible
              </Text>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  card: {
    width: '47%',
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: 'center',
    minHeight: 148,
    justifyContent: 'center',
  },
  mark: {
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
