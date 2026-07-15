import React, {useCallback, useEffect, useRef, useState} from 'react';
import {AppState, StyleSheet, Text, View} from 'react-native';
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
import {env} from '../../../config/env';
import {
  authenticateWithBiometrics,
  hasStoredPin,
  isBiometricUnlockEnabled,
} from '../../../services/secureStorage';
import {authApi} from '../../../services/api';
import {unwrap} from '../../../services/api/helpers';
import {ApiError} from '../../../types/api';
import {usePreferencesStore} from '../../../stores/preferencesStore';
import {useSessionStore} from '../../../stores/sessionStore';
import {withAppLockSuppressed} from '../../../stores/appLockGateStore';
import {useTheme} from '../../../theme/ThemeProvider';
import {useInputFocusChain} from '../../../hooks/useInputFocusChain';

type FormValues = z.infer<typeof pinSchema>;

/**
 * Overlay de déverrouillage — remonté à chaque cycle de lock (voir App.tsx)
 * pour réinitialiser auto-bio, erreurs et focus.
 */
export function AppLockScreen() {
  const theme = useTheme();
  const unlockApp = useSessionStore(s => s.unlockApp);
  const signOut = useSessionStore(s => s.signOut);
  const refreshLocalAuth = useSessionStore(s => s.refreshLocalAuth);
  const userHasPin = useSessionStore(s => Boolean(s.user?.hasPin));
  const biometricEnabled = usePreferencesStore(s => s.biometricEnabled);
  const [error, setError] = useState<string | null>(null);
  const [biometryBusy, setBiometryBusy] = useState(false);
  /** Afficher le PIN dès l’ouverture ; retirer seulement si Keychain confirme l’absence. */
  const [pinAvailable, setPinAvailable] = useState(true);
  const autoBioAttempted = useRef(false);
  const {control, handleSubmit, formState, reset} = useForm<FormValues>({
    resolver: zodResolver(pinSchema),
    defaultValues: {pin: ''},
  });
  const {fieldProps} = useInputFocusChain(['pin'] as const);

  const showPinField = pinAvailable || userHasPin;

  /**
   * Déverrouille dès le succès biométrique (avant waitUntilAppActive du gate),
   * sinon l’UI reste bloquée pendant le settle AppState Android post-empreinte.
   */
  const runBiometricUnlock = useCallback(async (): Promise<boolean> => {
    return withAppLockSuppressed(async () => {
      setBiometryBusy(true);
      try {
        const ok = await authenticateWithBiometrics();
        if (ok) {
          unlockApp();
        }
        return ok;
      } finally {
        setBiometryBusy(false);
      }
    });
  }, [unlockApp]);

  useEffect(() => {
    let cancelled = false;
    let appStateSub: {remove: () => void} | null = null;

    const tryAutoBiometrics = async (bioConfigured: boolean) => {
      if (cancelled || autoBioAttempted.current || !bioConfigured) {
        return;
      }
      if (AppState.currentState !== 'active') {
        return;
      }
      autoBioAttempted.current = true;
      await runBiometricUnlock();
    };

    (async () => {
      let pinConfigured = false;
      let bioConfigured = false;
      try {
        pinConfigured = await hasStoredPin();
        bioConfigured = await isBiometricUnlockEnabled();
      } catch {
        // En cas d’échec Keychain : garder le champ PIN (fallback).
        pinConfigured = true;
      }
      if (cancelled) {
        return;
      }

      usePreferencesStore.getState().setBiometricEnabled(bioConfigured);
      setPinAvailable(pinConfigured || userHasPin);
      await refreshLocalAuth();

      // Keychain incohérent : aucune preuve locale → déconnexion forcée.
      if (!pinConfigured && !bioConfigured && !userHasPin) {
        await signOut();
        return;
      }

      void tryAutoBiometrics(bioConfigured);

      // Si le mount arrive encore en `inactive` (retour foreground), réessayer.
      appStateSub = AppState.addEventListener('change', next => {
        if (next === 'active') {
          void tryAutoBiometrics(bioConfigured);
        }
      });
      if (cancelled) {
        appStateSub.remove();
        appStateSub = null;
      }
    })();

    return () => {
      cancelled = true;
      appStateSub?.remove();
    };
  }, [
    refreshLocalAuth,
    runBiometricUnlock,
    signOut,
    userHasPin,
  ]);

  const onUnlockWithPin = handleSubmit(async values => {
    setError(null);
    try {
      unwrap(await authApi.verifyPin(values.pin));
      unlockApp();
    } catch (e) {
      setError(
        e instanceof ApiError
          ? e.message
          : e instanceof Error
            ? e.message
            : 'PIN incorrect',
      );
      reset({pin: ''});
    }
  });

  const onUnlockWithBiometrics = async () => {
    setError(null);
    const ok = await runBiometricUnlock();
    if (ok) {
      return;
    }
    setError(
      showPinField
        ? 'Biométrie refusée ou indisponible — utilisez votre PIN.'
        : 'Biométrie refusée ou indisponible.',
    );
  };

  const pinField = fieldProps('pin', {
    onLastSubmit: () => {
      void onUnlockWithPin();
    },
  });

  const hint = showPinField
    ? biometricEnabled
      ? 'Entrez votre PIN ou utilisez Face ID / empreinte.'
      : 'Entrez votre PIN pour continuer en sécurité.'
    : 'Utilisez Face ID / empreinte pour continuer.';

  return (
    <BrandBackground variant="africa" overlayOpacity={0.55}>
      <Screen hideOfflineBanner transparent style={styles.screen}>
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
              {hint}
            </Text>

            {showPinField ? (
              <>
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
                      onChangeText={text =>
                        onChange(text.replace(/\D/g, '').slice(0, 6))
                      }
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
                {env.USE_MOCKS ? (
                  <Text
                    style={{
                      color: theme.colors.textMuted,
                      fontSize: theme.typography.caption,
                      textAlign: 'center',
                      marginBottom: theme.spacing.md,
                    }}>
                    Démo : {env.DEMO_PIN}
                  </Text>
                ) : null}
              </>
            ) : null}

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

            {showPinField ? (
              <Button
                label="Déverrouiller"
                loading={formState.isSubmitting}
                disabled={biometryBusy}
                onPress={() => {
                  void onUnlockWithPin();
                }}
              />
            ) : null}

            {biometricEnabled ? (
              <Button
                label="Face ID / empreinte"
                variant="secondary"
                loading={biometryBusy}
                disabled={formState.isSubmitting}
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
    paddingVertical: 24,
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
