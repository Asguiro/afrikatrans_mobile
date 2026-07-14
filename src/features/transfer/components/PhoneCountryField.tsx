import React, {forwardRef, useId, useMemo, useState} from 'react';
import {
  InputAccessoryView,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type {TextInputProps} from 'react-native';
import type {Country} from '../../../types/api';
import {useTheme} from '../../../theme/ThemeProvider';
import {COUNTRY_FLAGS} from '../constants/operatorBrands';

type Props = {
  label: string;
  countries: Country[];
  countryCode: string;
  nationalNumber: string;
  onCountryChange: (code: string) => void;
  onNumberChange: (digits: string) => void;
  hint?: string;
  returnKeyType?: TextInputProps['returnKeyType'];
  submitBehavior?: TextInputProps['submitBehavior'];
  onSubmitEditing?: TextInputProps['onSubmitEditing'];
  accessoryActionLabel?: string;
};

export const PhoneCountryField = forwardRef<TextInput, Props>(
  function PhoneCountryField(
    {
      label,
      countries,
      countryCode,
      nationalNumber,
      onCountryChange,
      onNumberChange,
      hint,
      returnKeyType,
      submitBehavior,
      onSubmitEditing,
      accessoryActionLabel = 'Suivant',
    },
    ref,
  ) {
    const theme = useTheme();
    const [pickerOpen, setPickerOpen] = useState(false);
    const accessoryId = useId();
    const needsAccessory = Platform.OS === 'ios' && Boolean(onSubmitEditing);

    const country = useMemo(
      () => countries.find(c => c.code === countryCode) ?? countries[0],
      [countries, countryCode],
    );

    const flag = COUNTRY_FLAGS[country?.code ?? ''] ?? '🌍';

    return (
      <View style={{marginBottom: theme.spacing.xl}}>
        <Text
          style={{
            color: theme.colors.textPrimary,
            fontWeight: '600',
            marginBottom: theme.spacing.sm,
            fontSize: theme.typography.bodySmall,
          }}>
          {label}
        </Text>
        <View
          style={[
            styles.row,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              borderRadius: theme.radius.md,
              minHeight: theme.controlHeights.large,
            },
          ]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Pays ${country?.name ?? ''}`}
            onPress={() => setPickerOpen(true)}
            style={[
              styles.prefix,
              {
                borderRightColor: theme.colors.divider,
                backgroundColor: theme.colors.brandPrimarySoft,
              },
            ]}>
            <Text style={styles.flag}>{flag}</Text>
            <Text
              style={{
                color: theme.colors.textPrimary,
                fontWeight: '700',
                fontSize: theme.typography.bodySmall,
              }}>
              {country?.dialCode ?? '+'}
            </Text>
          </Pressable>
          <TextInput
            ref={ref}
            accessibilityLabel={label}
            keyboardType="phone-pad"
            value={nationalNumber}
            onChangeText={text => onNumberChange(text.replace(/\D/g, ''))}
            placeholder="Numéro"
            placeholderTextColor={theme.colors.textMuted}
            returnKeyType={returnKeyType}
            submitBehavior={submitBehavior}
            onSubmitEditing={onSubmitEditing}
            inputAccessoryViewID={needsAccessory ? accessoryId : undefined}
            style={{
              flex: 1,
              paddingHorizontal: theme.spacing.md,
              color: theme.colors.textPrimary,
              fontSize: theme.typography.bodyLarge,
              fontWeight: '600',
            }}
          />
        </View>
        {hint ? (
          <Text
            style={{
              color: theme.colors.textMuted,
              fontSize: theme.typography.caption,
              marginTop: 6,
            }}>
            {hint}
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
                accessibilityLabel={accessoryActionLabel}
                hitSlop={8}
                onPress={() => {
                  if (onSubmitEditing) {
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
                  {accessoryActionLabel}
                </Text>
              </Pressable>
            </View>
          </InputAccessoryView>
        ) : null}

        <Modal
          visible={pickerOpen}
          animationType="slide"
          transparent
          onRequestClose={() => setPickerOpen(false)}>
          <Pressable
            style={styles.backdrop}
            onPress={() => setPickerOpen(false)}>
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
              <Text
                style={{
                  color: theme.colors.textPrimary,
                  fontWeight: '700',
                  fontSize: theme.typography.h4,
                  marginBottom: theme.spacing.lg,
                }}>
                Choisir le pays
              </Text>
              {countries.map(c => (
                <Pressable
                  key={c.code}
                  accessibilityRole="button"
                  onPress={() => {
                    onCountryChange(c.code);
                    setPickerOpen(false);
                  }}
                  style={{
                    paddingVertical: theme.spacing.md,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: theme.colors.divider,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                  }}>
                  <Text style={styles.flag}>
                    {COUNTRY_FLAGS[c.code] ?? '🌍'}
                  </Text>
                  <View style={{flex: 1}}>
                    <Text
                      style={{
                        color: theme.colors.textPrimary,
                        fontWeight: '600',
                      }}>
                      {c.name}
                    </Text>
                    <Text style={{color: theme.colors.textSecondary}}>
                      {c.dialCode} · {c.currency}
                    </Text>
                  </View>
                  {c.code === countryCode ? (
                    <Text style={{color: theme.colors.brandPrimary}}>✓</Text>
                  ) : null}
                </Pressable>
              ))}
            </Pressable>
          </Pressable>
        </Modal>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderWidth: 1,
    overflow: 'hidden',
  },
  prefix: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 6,
    borderRightWidth: 1,
  },
  flag: {
    fontSize: 22,
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
