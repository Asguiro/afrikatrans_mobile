import React, {useMemo, useState} from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {ChevronDown} from 'lucide-react-native';
import {useTheme} from '../../../theme/ThemeProvider';
import {
  OPERATOR_BRANDS,
  getBrandByCode,
  type OperatorBrandCode,
} from '../constants/operatorBrands';
import {OperatorLogoMark} from './OperatorBrandGrid';

type Props = {
  selectedCode?: string;
  onSelect: (code: OperatorBrandCode) => void;
  disabledCodes?: string[];
};

/** Déclencheur compact + modal pour choisir un wallet / opérateur. */
export function OperatorBrandDropdown({
  selectedCode,
  onSelect,
  disabledCodes = [],
}: Props) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const brand = useMemo(
    () => getBrandByCode(selectedCode) ?? OPERATOR_BRANDS[0],
    [selectedCode],
  );

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Opérateur ${brand.name}`}
        onPress={() => setOpen(true)}
        style={({pressed}) => [
          styles.trigger,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            borderRadius: theme.radius.md,
            opacity: pressed ? 0.88 : 1,
            minHeight: theme.controlHeights.large,
          },
        ]}>
        <OperatorLogoMark brand={brand} size={28} />
        <Text
          numberOfLines={1}
          style={{
            flex: 1,
            color: theme.colors.textPrimary,
            fontWeight: '700',
            fontSize: theme.typography.bodySmall,
          }}>
          {brand.name.replace(' Money', '').replace(' MoMo', '')}
        </Text>
        <ChevronDown color={theme.colors.textMuted} size={18} strokeWidth={2} />
      </Pressable>

      <Modal
        visible={open}
        animationType="slide"
        transparent
        onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable
            style={[
              styles.sheet,
              {
                backgroundColor: theme.colors.surface,
                borderTopLeftRadius: theme.radius.xl,
                borderTopRightRadius: theme.radius.xl,
              },
            ]}
            onPress={e => e.stopPropagation()}>
            <View
              style={[styles.handle, {backgroundColor: theme.colors.border}]}
            />
            <Text
              style={{
                color: theme.colors.textPrimary,
                fontWeight: '700',
                fontSize: theme.typography.h4,
                marginBottom: theme.spacing.lg,
              }}>
              Choisir l’opérateur
            </Text>
            <ScrollView keyboardShouldPersistTaps="handled">
              {OPERATOR_BRANDS.map(item => {
                const disabled = disabledCodes.includes(item.code);
                if (disabled) {
                  return null;
                }
                const selected = selectedCode === item.code;
                return (
                  <Pressable
                    key={item.code}
                    accessibilityRole="button"
                    accessibilityState={{selected, disabled}}
                    disabled={disabled}
                    onPress={() => {
                      onSelect(item.code);
                      setOpen(false);
                    }}
                    style={{
                      paddingVertical: theme.spacing.md,
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      borderBottomColor: theme.colors.divider,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 12,
                      minHeight: 52,
                      opacity: disabled ? 0.4 : 1,
                    }}>
                    <OperatorLogoMark brand={item} size={36} />
                    <Text
                      style={{
                        flex: 1,
                        color: theme.colors.textPrimary,
                        fontWeight: selected ? '700' : '600',
                      }}>
                      {item.name}
                    </Text>
                    {selected ? (
                      <Text style={{color: theme.colors.brandPrimary}}>✓</Text>
                    ) : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    padding: 24,
    paddingBottom: 40,
    maxHeight: '70%',
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    marginBottom: 16,
  },
});
