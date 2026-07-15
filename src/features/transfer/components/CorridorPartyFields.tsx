import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import type {TextInput} from 'react-native';
import type {Country} from '../../../types/api';
import {useTheme} from '../../../theme/ThemeProvider';
import {PhoneCountryField} from '../../../components/ui/PhoneCountryField';
import type {OperatorBrandCode} from '../constants/operatorBrands';
import {OperatorBrandSelect} from './OperatorBrandSelect';

type PhoneFieldBind = {
  ref?: (node: TextInput | null) => void;
  returnKeyType?: 'next' | 'done';
  submitBehavior?: 'submit' | 'blurAndSubmit';
  accessoryActionLabel?: string;
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
  phoneField?: PhoneFieldBind;
};

/** Bloc De / Vers : opérateur + pays/indicatif/téléphone. */
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
  phoneField,
}: Props) {
  const theme = useTheme();

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

      <OperatorBrandSelect
        label="Opérateur"
        selectedCode={operatorCode}
        onSelect={onOperatorChange}
      />

      <PhoneCountryField
        ref={phoneField?.ref}
        label={phoneLabel}
        countries={countries}
        countryCode={countryCode}
        nationalNumber={nationalNumber}
        onCountryChange={onCountryChange}
        onNumberChange={onNumberChange}
        hint={currencyHint}
        returnKeyType={phoneField?.returnKeyType}
        submitBehavior={phoneField?.submitBehavior}
        accessoryActionLabel={phoneField?.accessoryActionLabel}
        onSubmitEditing={phoneField?.onSubmitEditing}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
  },
});
