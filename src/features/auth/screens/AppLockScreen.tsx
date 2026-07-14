import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {Lock} from 'lucide-react-native';
import {z} from 'zod';
import {BrandBackground} from '../../../components/brand/BrandBackground';
import {BrandLogo} from '../../../components/brand/BrandLogo';
import {Button} from '../../../components/ui/Button';
import {Screen} from '../../../components/ui/Screen';
import {TextField} from '../../../components/ui/TextField';
import {pinSchema} from '../../../schemas/forms';
import {
  authenticateWithBiometrics,
  hasStoredPin,
  isBiometricUnlockEnabled,
  verifyStoredPin,
} from '../../../services/secureStorage';
import {usePreferencesStore} from '../../../stores/preferencesStore';
import {useSessionStore} from '../../../stores/sessionStore';
import {useTheme} from '../../../theme/ThemeProvider';
import {useInputFocusChain} from '../../../hooks/useInputFocusChain';

type FormValues = z.infer<typeof pinSchema>;

export function AppLockScreen() {
  const theme = useTheme();
  const unlockApp = useSessionStore(s => s.unlockApp);
  const signOut = useSessionStore(s => s.signOut);
  const biometricEnabled = usePreferencesStore(s => s.biometricEnabled);
  const [error, setError] = useState<string | null>(null);
  const [biometryBusy, setBiometryBusy] = useState(false);
  const {control, handleSubmit, formState} = useForm<FormValues>({
    resolver: zodResolver(pinSchema),
    defaultValues: {pin: ''},
  });
  const {fieldProps} = useInputFocusChain(['pin'] as const);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const pinConfigured = await hasStoredPin();
      const bioConfigured = await isBiometricUnlockEnabled();
      if (!pinConfigured && !bioConfigured) {
        if (!cancelled) {
          unlockApp();
        }
        return;
      }
      if (!biometricEnabled || !bioConfigured) {
        return;
      }
      setBiometryBusy(true);
      const ok = await authenticateWithBiometrics();
      if (!cancelled && ok) {
        unlockApp();
      }
      if (!cancelled) {
        setBiometryBusy(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [biometricEnabled, unlockApp]);

  const onUnlockWithPin = handleSubmit(async values => {
    setError(null);
    const ok = await verifyStoredPin(values.pin);
    if (!ok) {
      setError('PIN incorrect');
      return;
    }
    unlockApp();
  });

  const onUnlockWithBiometrics = async () => {
    setError(null);
    setBiometryBusy(true);
    try {
      const ok = await authenticateWithBiometrics();
      if (ok) {
        unlockApp();
      } else {
        setError('Biométrie refusée ou indisponible');
      }
    } finally {
      setBiometryBusy(false);
    }
  };

  const pinField = fieldProps('pin', {
    onLastSubmit: () => {
      void onUnlockWithPin();
    },
  });

  return (
    <BrandBackground variant="africa" overlayOpacity={0.55}>
      <Screen centered hideOfflineBanner transparent style={styles.screen}>
        <View style={styles.center}>
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                borderRadius: theme.radius.xl,
              },
            ]}>
            <View style={styles.brand}>
              <BrandLogo variant="icon" size={56} plate="plain" />
            </View>

            <View
              style={[
                styles.lockBadge,
                {backgroundColor: theme.colors.brandPrimarySoft},
              ]}>
              <Lock
                color={theme.colors.brandPrimary}
                size={22}
                strokeWidth={2.25}
              />
            </View>

            <Text
              accessibilityRole="header"
              style={{
                color: theme.colors.textPrimary,
                fontSize: theme.typography.h3,
                fontWeight: '800',
                textAlign: 'center',
                marginBottom: theme.spacing.sm,
              }}>
              Session verrouillée
            </Text>
            <Text
              style={{
                color: theme.colors.textSecondary,
                fontSize: theme.typography.bodySmall,
                textAlign: 'center',
                lineHeight: 20,
                marginBottom: theme.spacing['2xl'],
              }}>
              {biometricEnabled
                ? 'Entrez votre PIN ou utilisez Face ID / empreinte.'
                : 'Entrez votre PIN pour continuer en sécurité.'}
            </Text>

            <Controller
              control={control}
              name="pin"
              render={({field: {onChange, value}}) => (
                <TextField
                  ref={pinField.ref}
                  label="Code PIN"
                  secureTextEntry
                  keyboardType="number-pad"
                  value={value}
                  onChangeText={onChange}
                  error={formState.errors.pin?.message}
                  maxLength={6}
                  returnKeyType={pinField.returnKeyType}
                  submitBehavior={pinField.submitBehavior}
                  accessoryActionLabel={pinField.accessoryActionLabel}
                  onSubmitEditing={pinField.onSubmitEditing}
                  textAlign="center"
                  style={{letterSpacing: 8, fontWeight: '700'}}
                />
              )}
            />

            {error ? (
              <Text
                accessibilityRole="alert"
                style={{
                  color: theme.colors.error,
                  marginBottom: 12,
                  textAlign: 'center',
                }}>
                {error}
              </Text>
            ) : null}

            <Button
              label="Déverrouiller"
              loading={formState.isSubmitting}
              onPress={onUnlockWithPin}
            />

            {biometricEnabled ? (
              <Button
                label="Face ID / empreinte"
                variant="secondary"
                loading={biometryBusy}
                onPress={() => {
                  void onUnlockWithBiometrics();
                }}
                style={{marginTop: 12}}
              />
            ) : null}

            <Button
              label="Se déconnecter"
              variant="ghost"
              onPress={() => {
                void signOut();
              }}
              style={{marginTop: 8}}
            />
          </View>
        </View>
      </Screen>
    </BrandBackground>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 0,
  },
  center: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    paddingHorizontal: 24,
  },
  card: {
    borderWidth: 1,
    padding: 24,
  },
  brand: {
    alignItems: 'center',
    marginBottom: 16,
  },
  lockBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
});
