import React from 'react';
import {
  InputAccessoryView,
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {ArrowDown} from 'lucide-react-native';
import {useTheme} from '../../../theme/ThemeProvider';
import {formatMoney} from '../../../utils/format';

type FieldKey = 'SEND' | 'RECEIVE';

type AmountRowProps = {
  label: string;
  hint: string;
  valueDigits: string;
  currency: string;
  focused: boolean;
  onChangeDigits: (digits: string) => void;
  onFocus: () => void;
  onSubmitEditing?: () => void;
  returnKeyType?: 'next' | 'done';
  accessoryActionLabel?: string;
  inputRef?: (node: TextInput | null) => void;
  accessibilityLabel: string;
};

function digitsOnly(raw: string): string {
  return raw.replace(/\D/g, '');
}

/** Affichage fr-FR : 25000 → "25 000". */
export function formatAmountDigits(digits: string): string {
  if (!digits) {
    return '';
  }
  const n = Number(digits);
  if (!Number.isFinite(n)) {
    return digits;
  }
  return new Intl.NumberFormat('fr-FR', {maximumFractionDigits: 0}).format(n);
}

function AmountRow({
  label,
  hint,
  valueDigits,
  currency,
  focused,
  onChangeDigits,
  onFocus,
  onSubmitEditing,
  returnKeyType = 'done',
  accessoryActionLabel = 'OK',
  inputRef,
  accessibilityLabel,
}: AmountRowProps) {
  const theme = useTheme();
  const accessoryId = React.useId();
  const localRef = React.useRef<TextInput | null>(null);
  const needsAccessory = Platform.OS === 'ios';
  const display = formatAmountDigits(valueDigits);

  const focusInput = () => {
    onFocus();
    localRef.current?.focus();
  };

  return (
    <View style={styles.rowBlock}>
      <Text
        style={{
          color: theme.colors.textSecondary,
          fontSize: theme.typography.bodySmall,
          fontWeight: '700',
          letterSpacing: 0.2,
          marginBottom: 8,
        }}>
        {label}
      </Text>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={focusInput}
        style={[
          styles.inputWell,
          {
            backgroundColor: focused
              ? theme.colors.brandPrimarySoft
              : theme.colors.surfaceRaised,
            borderColor: focused
              ? theme.colors.brandPrimary
              : theme.colors.border,
            borderWidth: focused ? 2 : 1.5,
            borderRadius: theme.radius.lg,
          },
        ]}>
        <TextInput
          ref={node => {
            localRef.current = node;
            inputRef?.(node);
          }}
          accessibilityLabel={accessibilityLabel}
          keyboardType="number-pad"
          value={display}
          placeholder="0"
          placeholderTextColor={theme.colors.textMuted}
          onFocus={onFocus}
          onChangeText={text => onChangeDigits(digitsOnly(text))}
          returnKeyType={returnKeyType}
          submitBehavior={returnKeyType === 'next' ? 'submit' : 'blurAndSubmit'}
          onSubmitEditing={onSubmitEditing}
          inputAccessoryViewID={needsAccessory ? accessoryId : undefined}
          style={{
            flex: 1,
            color: theme.colors.textPrimary,
            fontSize: 34,
            fontWeight: '800',
            letterSpacing: -0.5,
            paddingVertical: Platform.OS === 'ios' ? 14 : 10,
            minHeight: 56,
          }}
        />
        <View
          style={[
            styles.currencyChip,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}>
          <Text
            style={{
              color: theme.colors.textPrimary,
              fontWeight: '800',
              fontSize: theme.typography.bodySmall,
            }}>
            {currency}
          </Text>
        </View>
      </Pressable>

      <Text
        style={{
          color: theme.colors.textMuted,
          fontSize: theme.typography.caption,
          marginTop: 8,
          lineHeight: 18,
        }}>
        {hint}
      </Text>

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
                  onSubmitEditing();
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
    </View>
  );
}

type Props = {
  sendDigits: string;
  receiveDigits: string;
  currency: string;
  activeField: FieldKey;
  feeAmount: number;
  sendHelper: string;
  receiveHelper: string;
  onChangeSend: (digits: string) => void;
  onChangeReceive: (digits: string) => void;
  onFocusField: (field: FieldKey) => void;
  sendField: {
    ref: (node: TextInput | null) => void;
    returnKeyType: 'next' | 'done';
    accessoryActionLabel: string;
    onSubmitEditing: () => void;
  };
  receiveField: {
    ref: (node: TextInput | null) => void;
    returnKeyType: 'next' | 'done';
    accessoryActionLabel: string;
    onSubmitEditing: () => void;
  };
};

/**
 * Composeur montant type transfert : deux puits de saisie
 * clairement éditables, reliés par les frais.
 */
export function AmountComposer({
  sendDigits,
  receiveDigits,
  currency,
  activeField,
  feeAmount,
  sendHelper,
  receiveHelper,
  onChangeSend,
  onChangeReceive,
  onFocusField,
  sendField,
  receiveField,
}: Props) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.xl,
        },
      ]}>
      <AmountRow
        label="Vous envoyez"
        hint={sendHelper}
        valueDigits={sendDigits}
        currency={currency}
        focused={activeField === 'SEND'}
        onChangeDigits={onChangeSend}
        onFocus={() => onFocusField('SEND')}
        inputRef={sendField.ref}
        returnKeyType={sendField.returnKeyType}
        accessoryActionLabel={sendField.accessoryActionLabel}
        onSubmitEditing={sendField.onSubmitEditing}
        accessibilityLabel={`Montant envoyé en ${currency}`}
      />

      <View style={styles.bridge}>
        <View
          style={[styles.bridgeLine, {backgroundColor: theme.colors.divider}]}
        />
        <View
          style={[
            styles.bridgePill,
            {
              backgroundColor: theme.colors.brandAccentSoft,
              borderColor: theme.colors.border,
            },
          ]}>
          <ArrowDown
            color={theme.colors.brandPrimary}
            size={16}
            strokeWidth={2.5}
          />
          <Text
            style={{
              color: theme.colors.textPrimary,
              fontWeight: '700',
              fontSize: theme.typography.caption,
              marginLeft: 6,
            }}>
            {feeAmount > 0
              ? `Frais ${formatMoney(feeAmount, currency)}`
              : 'Saisir un montant'}
          </Text>
        </View>
        <View
          style={[styles.bridgeLine, {backgroundColor: theme.colors.divider}]}
        />
      </View>

      <AmountRow
        label="Le destinataire reçoit"
        hint={receiveHelper}
        valueDigits={receiveDigits}
        currency={currency}
        focused={activeField === 'RECEIVE'}
        onChangeDigits={onChangeReceive}
        onFocus={() => onFocusField('RECEIVE')}
        inputRef={receiveField.ref}
        returnKeyType={receiveField.returnKeyType}
        accessoryActionLabel={receiveField.accessoryActionLabel}
        onSubmitEditing={receiveField.onSubmitEditing}
        accessibilityLabel={`Montant reçu en ${currency}`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    padding: 20,
    marginBottom: 20,
  },
  rowBlock: {
    marginBottom: 4,
  },
  inputWell: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 10,
    minHeight: 64,
  },
  currencyChip: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 8,
  },
  bridge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  bridgeLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  bridgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 10,
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
