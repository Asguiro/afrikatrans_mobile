import React from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useTheme} from '../../../theme/ThemeProvider';
import {
  OPERATOR_BRANDS,
  type OperatorBrandCode,
} from '../constants/operatorBrands';
import {OperatorLogoMark} from './OperatorBrandGrid';

type Props = {
  label: string;
  selectedCode?: string;
  onSelect: (code: OperatorBrandCode) => void;
  disabledCodes?: string[];
};

/** Sélecteur compact d’opérateur (ligne scrollable). */
export function OperatorBrandSelect({
  label,
  selectedCode,
  onSelect,
  disabledCodes = [],
}: Props) {
  const theme = useTheme();

  return (
    <View style={{marginBottom: theme.spacing.md}}>
      <Text
        style={{
          color: theme.colors.textPrimary,
          fontWeight: '600',
          marginBottom: theme.spacing.xs,
          fontSize: theme.typography.caption,
        }}>
        {label}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}>
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
                styles.chip,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: selected
                    ? theme.colors.brandPrimary
                    : theme.colors.border,
                  borderWidth: selected ? 2 : 1,
                  opacity: disabled ? 0.4 : pressed ? 0.85 : 1,
                  borderRadius: theme.radius.md,
                },
              ]}>
              <OperatorLogoMark brand={brand} size={32} />
              <Text
                style={{
                  marginTop: 4,
                  color: theme.colors.textPrimary,
                  fontWeight: selected ? '700' : '600',
                  fontSize: 10,
                  textAlign: 'center',
                }}
                numberOfLines={1}>
                {brand.name.replace(' Money', '').replace(' MoMo', '')}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 8,
    paddingVertical: 2,
  },
  chip: {
    width: 76,
    paddingVertical: 8,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
});
