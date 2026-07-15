import React, {useCallback, useEffect, useState} from 'react';
import {Alert, Pressable, StyleSheet, Switch, Text, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  Check,
  ChevronRight,
  KeyRound,
  Lock,
  Moon,
  Monitor,
  Sun,
} from 'lucide-react-native';
import type {AppStackParamList} from '../../../navigation/types';
import {Screen} from '../../../components/ui/Screen';
import {ListGroup, ListRow, IconBubble} from '../../../components/ui/ListRow';
import {usePreferencesStore} from '../../../stores/preferencesStore';
import {useSessionStore} from '../../../stores/sessionStore';
import {useTheme} from '../../../theme/ThemeProvider';
import {
  disableBiometricUnlock,
  enableBiometricUnlock,
  getSupportedBiometryType,
  hasStoredPin,
} from '../../../services/secureStorage';
import {withAppLockSuppressed} from '../../../stores/appLockGateStore';

type AppearanceProps = NativeStackScreenProps<AppStackParamList, 'Appearance'>;
type SecurityProps = NativeStackScreenProps<AppStackParamList, 'Security'>;

const appearanceOptions: Array<{
  id: 'system' | 'light' | 'dark';
  title: string;
  subtitle: string;
  icon: 'system' | 'light' | 'dark';
}> = [
  {
    id: 'system',
    title: 'Système',
    subtitle: 'Suit le réglage de l’appareil',
    icon: 'system',
  },
  {
    id: 'light',
    title: 'Clair',
    subtitle: 'Fond clair, contraste élevé',
    icon: 'light',
  },
  {
    id: 'dark',
    title: 'Sombre',
    subtitle: 'Confort en faible luminosité',
    icon: 'dark',
  },
];

export function AppearanceScreen(_props: AppearanceProps) {
  const theme = useTheme();
  const setAppearance = usePreferencesStore(s => s.setAppearance);
  const appearance = usePreferencesStore(s => s.appearance);

  return (
    <Screen
      title="Apparence"
      subtitle="Choisissez le thème qui vous convient.">
      <ListGroup>
        {appearanceOptions.map((option, index) => {
          const selected = appearance === option.id;
          return (
            <Pressable
              key={option.id}
              accessibilityRole="button"
              accessibilityState={{selected}}
              onPress={() => setAppearance(option.id)}
              style={({pressed}) => ({
                opacity: pressed ? 0.75 : 1,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 14,
                paddingVertical: 14,
                minHeight: theme.controlHeights.large,
                borderBottomWidth:
                  index < appearanceOptions.length - 1
                    ? StyleSheet.hairlineWidth
                    : 0,
                borderBottomColor: theme.colors.divider,
              })}>
              <IconBubble
                soft={
                  selected
                    ? theme.colors.brandPrimarySoft
                    : theme.isDark
                      ? theme.colors.surfaceRaised
                      : '#F0F3F8'
                }>
                {option.icon === 'system' ? (
                  <Monitor
                    color={theme.colors.brandPrimary}
                    size={18}
                    strokeWidth={2}
                  />
                ) : option.icon === 'light' ? (
                  <Sun color={theme.colors.warning} size={18} strokeWidth={2} />
                ) : (
                  <Moon color={theme.colors.info} size={18} strokeWidth={2} />
                )}
              </IconBubble>
              <View style={{flex: 1, marginLeft: 12}}>
                <Text
                  style={{
                    color: theme.colors.textPrimary,
                    fontWeight: '600',
                  }}>
                  {option.title}
                </Text>
                <Text
                  style={{
                    color: theme.colors.textMuted,
                    fontSize: 12,
                    marginTop: 2,
                  }}>
                  {option.subtitle}
                </Text>
              </View>
              {selected ? (
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: theme.colors.brandPrimary,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Check
                    color={theme.colors.onBrandPrimary}
                    size={14}
                    strokeWidth={3}
                  />
                </View>
              ) : (
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    borderWidth: 1.5,
                    borderColor: theme.colors.border,
                  }}
                />
              )}
            </Pressable>
          );
        })}
      </ListGroup>
    </Screen>
  );
}

export function SecurityScreen({navigation}: SecurityProps) {
  const theme = useTheme();
  const biometricEnabled = usePreferencesStore(s => s.biometricEnabled);
  const setBiometricEnabled = usePreferencesStore(s => s.setBiometricEnabled);
  const refreshLocalAuth = useSessionStore(s => s.refreshLocalAuth);
  const [biometryAvailable, setBiometryAvailable] = useState(false);
  const [biometryLabel, setBiometryLabel] = useState('Face ID / empreinte');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void getSupportedBiometryType().then(type => {
      setBiometryAvailable(Boolean(type));
      if (type === 'FaceID') {
        setBiometryLabel('Face ID');
      } else if (type === 'TouchID' || type === 'Fingerprint') {
        setBiometryLabel('Empreinte');
      } else if (type) {
        setBiometryLabel(type);
      }
    });
  }, []);

  const enableBiometrics = useCallback(async () => {
    if (!biometryAvailable) {
      Alert.alert(
        'Biométrie indisponible',
        'Aucune Face ID / empreinte n’est configurée sur cet appareil.',
      );
      return;
    }
    const pinConfigured = await hasStoredPin();
    if (!pinConfigured) {
      Alert.alert(
        'PIN requis',
        'Configurez d’abord un code PIN avant d’activer la biométrie.',
      );
      return;
    }
    const ok = await withAppLockSuppressed(() => enableBiometricUnlock());
    if (!ok) {
      Alert.alert(
        'Activation impossible',
        'La biométrie n’a pas pu être activée. Réessayez.',
      );
      return;
    }
    setBiometricEnabled(true);
    await refreshLocalAuth();
  }, [biometryAvailable, refreshLocalAuth, setBiometricEnabled]);

  const disableBiometrics = useCallback(async () => {
    await disableBiometricUnlock();
    setBiometricEnabled(false);
    await refreshLocalAuth();
  }, [refreshLocalAuth, setBiometricEnabled]);

  const onToggleBiometrics = useCallback(
    (next: boolean) => {
      if (busy) {
        return;
      }
      if (next) {
        setBusy(true);
        void enableBiometrics().finally(() => setBusy(false));
        return;
      }
      Alert.alert(
        'Désactiver la biométrie ?',
        'Vous utiliserez uniquement votre code PIN pour déverrouiller l’application.',
        [
          {text: 'Annuler', style: 'cancel'},
          {
            text: 'Désactiver',
            style: 'destructive',
            onPress: () => {
              setBusy(true);
              void disableBiometrics().finally(() => setBusy(false));
            },
          },
        ],
      );
    },
    [busy, disableBiometrics, enableBiometrics],
  );

  return (
    <Screen
      title="Sécurité"
      subtitle="Protégez vos transferts et votre session.">
      <View
        style={{
          backgroundColor: theme.colors.infoSoft,
          borderRadius: theme.radius.lg,
          padding: theme.spacing.lg,
          marginBottom: theme.spacing.xl,
        }}>
        <Text
          style={{
            color: theme.colors.info,
            fontSize: theme.typography.bodySmall,
            lineHeight: 20,
          }}>
          Les jetons d’accès sont stockés dans le Keychain / Keystore — jamais
          en AsyncStorage. L’app se verrouille au démarrage et après une courte
          absence en arrière-plan (PIN / biométrie).
        </Text>
      </View>

      <ListGroup title="Identifiants">
        <ListRow
          label="Mot de passe"
          subtitle="Changer le mot de passe de connexion"
          onPress={() => navigation.navigate('ChangePassword')}
          leading={
            <IconBubble>
              <KeyRound
                color={theme.colors.brandPrimary}
                size={18}
                strokeWidth={2}
              />
            </IconBubble>
          }
          trailing={
            <ChevronRight color={theme.colors.textMuted} size={18} />
          }
        />
        <ListRow
          label="Code PIN"
          subtitle="Déverrouillage et confirmation de transfert"
          onPress={() => navigation.navigate('ChangePin')}
          leading={
            <IconBubble soft={theme.colors.warningSoft}>
              <Lock color={theme.colors.warning} size={18} strokeWidth={2} />
            </IconBubble>
          }
          trailing={
            <ChevronRight color={theme.colors.textMuted} size={18} />
          }
          last
        />
      </ListGroup>

      <ListGroup title="Biométrie">
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 14,
            paddingVertical: 12,
            minHeight: 58,
          }}>
          <View style={{flex: 1, paddingRight: 12}}>
            <Text
              style={{
                color: theme.colors.textPrimary,
                fontWeight: '600',
              }}>
              {biometryLabel}
            </Text>
            <Text
              style={{
                color: theme.colors.textMuted,
                fontSize: 12,
                marginTop: 2,
              }}>
              {biometryAvailable
                ? 'Déverrouillage rapide de l’application'
                : 'Non disponible sur cet appareil'}
            </Text>
          </View>
          <Switch
            accessibilityLabel={`Activer ${biometryLabel}`}
            value={biometricEnabled}
            disabled={busy || (!biometryAvailable && !biometricEnabled)}
            onValueChange={onToggleBiometrics}
            trackColor={{
              false: theme.colors.border,
              true: theme.colors.brandPrimary,
            }}
            thumbColor={theme.colors.onBrandPrimary}
          />
        </View>
      </ListGroup>
    </Screen>
  );
}
