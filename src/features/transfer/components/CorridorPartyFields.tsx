import React, {useId, useMemo, useState} from 'react';
import {
  InputAccessoryView,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {BookUser, ChevronDown} from 'lucide-react-native';
import type {Country} from '../../../types/api';
import {useTheme} from '../../../theme/ThemeProvider';
import {COUNTRY_FLAGS} from '../constants/operatorBrands';
import type {OperatorBrandCode} from '../constants/operatorBrands';
import {OperatorBrandDropdown} from './OperatorBrandDropdown';
import {TextField} from '../../../components/ui/TextField';
import {useKeyboardScroll} from '../../../components/ui/keyboardScrollContext';

type PhoneFieldBind = {
  ref?: (node: TextInput | null) => void;
  returnKeyType?: 'next' | 'done';
  submitBehavior?: 'submit' | 'blurAndSubmit';
  accessoryActionLabel?: string;
  onSubmitEditing?: () => void;
};

type NameFieldBind = {
  ref?: (node: TextInput | null) => void;
  returnKeyType?: 'next' | 'done';
  submitBehavior?: 'submit' | 'blurAndSubmit';
  onSubmitEditing?: () => void;
};

type Props = {
  title: string;
  countries: Country[];
  countryCode: string;
  nationalNumber: string;
  operatorCode?: string;
  phoneLabel: string;
  currencyHint?: string;
  onCountryChange: (code: string) => void;
  onNumberChange: (digits: string) => void;
  onOperatorChange: (code: OperatorBrandCode) => void;
  /** Marques absentes / indisponibles pour ce pays. */
  disabledOperatorCodes?: string[];
  phoneField?: PhoneFieldBind;
  /** Icône carnet (bénéficiaire uniquement). */
  onContactPress?: () => void;
  beneficiaryName?: string;
  onBeneficiaryNameChange?: (value: string) => void;
  nameField?: NameFieldBind;
};

/** Bloc De / Vers : pays + wallet compacts, téléphone, nom optionnel. */
export function CorridorPartyFields({
  title,
  countries,
  countryCode,
  nationalNumber,
  operatorCode,
  phoneLabel,
  currencyHint,
  onCountryChange,
  onNumberChange,
  onOperatorChange,
  disabledOperatorCodes,
  phoneField,
  onContactPress,
  beneficiaryName,
  onBeneficiaryNameChange,
  nameField,
}: Props) {
  const theme = useTheme();
  const keyboardScroll = useKeyboardScroll();
  const [pickerOpen, setPickerOpen] = useState(false);
  const accessoryId = useId();
  const needsAccessory =
    Platform.OS === 'ios' && Boolean(phoneField?.onSubmitEditing);

  const country = useMemo(
    () => countries.find(c => c.code === countryCode) ?? countries[0],
    [countries, countryCode],
  );
  const flag = COUNTRY_FLAGS[country?.code ?? ''] ?? '🌍';

  return (
    <View
      style={[
        styles.block,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.lg,
        },
      ]}>
      <Text
        style={{
          color: theme.colors.brandPrimary,
          fontWeight: '800',
          fontSize: theme.typography.body,
          marginBottom: theme.spacing.sm,
        }}>
        {title}
      </Text>

      <View style={[styles.selectors, {gap: theme.spacing.sm}]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Pays ${country?.name ?? ''}`}
          onPress={() => setPickerOpen(true)}
          style={({pressed}) => [
            styles.countryTrigger,
            {
              backgroundColor: theme.colors.background,
              borderColor: theme.colors.border,
              borderRadius: theme.radius.md,
              minHeight: theme.controlHeights.large,
              opacity: pressed ? 0.88 : 1,
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
          <ChevronDown
            color={theme.colors.textMuted}
            size={16}
            strokeWidth={2}
          />
        </Pressable>

        <OperatorBrandDropdown
          selectedCode={operatorCode}
          onSelect={onOperatorChange}
          disabledCodes={disabledOperatorCodes}
        />
      </View>

      <Text
        style={{
          color: theme.colors.textPrimary,
          fontWeight: '600',
          marginBottom: theme.spacing.sm,
          marginTop: theme.spacing.md,
          fontSize: theme.typography.bodySmall,
        }}>
        {phoneLabel}
      </Text>
      <View
        style={[
          styles.phoneRow,
          {
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.border,
            borderRadius: theme.radius.md,
            minHeight: theme.controlHeights.large,
          },
        ]}>
        <TextInput
          ref={phoneField?.ref}
          accessibilityLabel={phoneLabel}
          keyboardType="phone-pad"
          value={nationalNumber}
          onChangeText={text => onNumberChange(text.replace(/\D/g, ''))}
          placeholder="Numéro"
          placeholderTextColor={theme.colors.textMuted}
          returnKeyType={phoneField?.returnKeyType}
          submitBehavior={phoneField?.submitBehavior}
          onSubmitEditing={phoneField?.onSubmitEditing}
          onFocus={() => keyboardScroll?.onInputFocus()}
          inputAccessoryViewID={needsAccessory ? accessoryId : undefined}
          style={{
            flex: 1,
            paddingHorizontal: theme.spacing.md,
            color: theme.colors.textPrimary,
            fontSize: theme.typography.bodyLarge,
            fontWeight: '600',
          }}
        />
        {onContactPress ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Choisir un contact"
            hitSlop={8}
            onPress={onContactPress}
            style={{
              width: 44,
              height: 44,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 4,
            }}>
            <BookUser
              color={theme.colors.brandPrimary}
              size={22}
              strokeWidth={2.2}
            />
          </Pressable>
        ) : null}
      </View>
      {currencyHint ? (
        <Text
          style={{
            color: theme.colors.textMuted,
            fontSize: theme.typography.caption,
            marginTop: 6,
          }}>
          {currencyHint}
        </Text>
      ) : null}

      {onBeneficiaryNameChange != null ? (
        <View style={{marginTop: theme.spacing.md}}>
          <TextField
            ref={nameField?.ref}
            label="Nom et prénom du bénéficiaire"
            autoCapitalize="words"
            value={beneficiaryName ?? ''}
            onChangeText={onBeneficiaryNameChange}
            returnKeyType={nameField?.returnKeyType}
            submitBehavior={nameField?.submitBehavior}
            onSubmitEditing={nameField?.onSubmitEditing}
          />
        </View>
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
              accessibilityLabel={phoneField?.accessoryActionLabel ?? 'Suivant'}
              hitSlop={8}
              onPress={() => {
                if (phoneField?.onSubmitEditing) {
                  phoneField.onSubmitEditing();
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
                {phoneField?.accessoryActionLabel ?? 'Suivant'}
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
              Choisir le pays
            </Text>
            <ScrollView
              style={styles.sheetScroll}
              keyboardShouldPersistTaps="handled">
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
                    minHeight: 52,
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
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
  },
  selectors: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  countryTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    paddingHorizontal: 10,
    minWidth: 108,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    overflow: 'hidden',
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
  sheetScroll: {
    maxHeight: 360,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    marginBottom: 16,
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
