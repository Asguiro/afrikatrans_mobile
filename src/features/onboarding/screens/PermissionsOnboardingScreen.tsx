import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  Bell,
  Camera,
  Contact,
  Image as ImageIcon,
  type LucideIcon,
} from 'lucide-react-native';
import type {OnboardingStackParamList} from '../../../navigation/types';
import {Button} from '../../../components/ui/Button';
import {BrandBackground} from '../../../components/brand/BrandBackground';
import {BrandLogo} from '../../../components/brand/BrandLogo';
import {useTheme} from '../../../theme/ThemeProvider';
import {usePreferencesStore} from '../../../stores/preferencesStore';
import {requestPermission} from '../../../permissions/permissionsService';
import {
  ONBOARDING_PERMISSIONS,
  type OnboardingPermission,
} from '../../../permissions/types';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Permissions'>;

/**
 * Pré-permission « best practice » (Apple HIG / NN/g) :
 * 1 écran = 1 droit, bénéfice d’abord, dialog OS seulement si l’utilisateur accepte.
 * « Plus tard » ne brûle pas la demande native.
 */
type Step = {
  permission: OnboardingPermission;
  Icon: LucideIcon;
  headline: string;
  body: string;
  cta: string;
  accent: 'primary' | 'accent' | 'info' | 'success';
  bg: 'africa' | 'world';
};

const STEPS: Step[] = [
  {
    permission: 'notifications',
    Icon: Bell,
    headline: 'Ne ratez aucun transfert',
    body: 'Recevez le statut de vos envois en temps réel, dès que l’argent part ou arrive.',
    cta: 'Activer les alertes',
    accent: 'accent',
    bg: 'africa',
  },
  {
    permission: 'contacts',
    Icon: Contact,
    headline: 'Envoyez en un geste',
    body: 'Choisissez un bénéficiaire depuis votre carnet — sans retaper le numéro.',
    cta: 'Autoriser les contacts',
    accent: 'primary',
    bg: 'world',
  },
  {
    permission: 'camera',
    Icon: Camera,
    headline: 'Vérifiez votre identité',
    body: 'Photographiez votre pièce et prenez un selfie pour finaliser votre KYC.',
    cta: 'Autoriser la caméra',
    accent: 'info',
    bg: 'africa',
  },
  {
    permission: 'photoLibrary',
    Icon: ImageIcon,
    headline: 'Importez vos documents',
    body: 'Sélectionnez une photo de profil ou un justificatif depuis votre galerie.',
    cta: 'Autoriser les photos',
    accent: 'success',
    bg: 'world',
  },
];

export function PermissionsOnboardingScreen({navigation}: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const {width, height} = useWindowDimensions();
  const setOnboardingCompleted = usePreferencesStore(
    s => s.setOnboardingCompleted,
  );
  const setPermissionsOnboardingSeen = usePreferencesStore(
    s => s.setPermissionsOnboardingSeen,
  );

  const [index, setIndex] = useState(0);
  const [busy, setBusy] = useState(false);
  const fade = useRef(new Animated.Value(1)).current;
  const rise = useRef(new Animated.Value(0)).current;

  // Toujours un step valide (évite crash HMR / index stale).
  const safeIndex = Math.min(Math.max(index, 0), STEPS.length - 1);
  const step = STEPS[safeIndex];
  const Icon = step.Icon;

  const orbSize = Math.min(148, Math.max(112, width * 0.34));
  const iconSize = Math.round(orbSize * 0.38);

  const accentColor = {
    primary: theme.colors.brandPrimary,
    accent: theme.colors.brandAccent,
    info: theme.colors.info,
    success: theme.colors.success,
  }[step.accent];

  const softColor = {
    primary: theme.colors.brandPrimarySoft,
    accent: theme.colors.brandAccentSoft,
    info: theme.colors.infoSoft,
    success: theme.colors.successSoft,
  }[step.accent];

  useEffect(() => {
    if (index !== safeIndex) {
      setIndex(safeIndex);
      return;
    }
    fade.setValue(0);
    rise.setValue(18);
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(rise, {
        toValue: 0,
        duration: 360,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [index, safeIndex, fade, rise]);

  const finish = () => {
    setPermissionsOnboardingSeen(true);
    setOnboardingCompleted(true);
    navigation.getParent()?.navigate('Auth');
  };

  const goNext = () => {
    if (safeIndex >= STEPS.length - 1) {
      finish();
      return;
    }
    setIndex(safeIndex + 1);
  };

  /** Accepte la pré-permission → dialog OS, puis étape suivante. */
  const onAllow = async () => {
    setBusy(true);
    try {
      await requestPermission(step.permission);
    } finally {
      setBusy(false);
      goNext();
    }
  };

  /** Refuse la pré-permission → on ne touche pas au dialog OS. */
  const onLater = () => {
    if (busy) {
      return;
    }
    goNext();
  };

  const skipAll = () => {
    if (busy) {
      return;
    }
    finish();
  };

  return (
    <BrandBackground variant={step.bg} overlayOpacity={0.48}>
      <View
        style={[
          styles.root,
          {
            paddingTop: Math.max(insets.top, 12),
            paddingBottom: Math.max(insets.bottom, 20),
            paddingHorizontal: theme.spacing['2xl'],
          },
        ]}>
        <View style={styles.topBar}>
          <BrandLogo variant="horizontal" size={40} plate="plain" />
          <Text
            accessibilityRole="button"
            accessibilityLabel="Tout passer"
            onPress={skipAll}
            suppressHighlighting
            style={{
              color: theme.colors.textSecondary,
              fontWeight: '600',
              fontSize: theme.typography.bodySmall,
              paddingVertical: 8,
              paddingHorizontal: 4,
              opacity: busy ? 0.4 : 1,
            }}>
            Passer
          </Text>
        </View>

        <Animated.View
          style={[
            styles.stage,
            {
              opacity: fade,
              transform: [{translateY: rise}],
              minHeight: Math.min(420, height * 0.55),
            },
          ]}>
          <View
            style={[
              styles.orbOuter,
              {
                width: orbSize + 28,
                height: orbSize + 28,
                borderRadius: (orbSize + 28) / 2,
                backgroundColor: softColor,
              },
            ]}>
            <View
              style={[
                styles.orbInner,
                {
                  width: orbSize,
                  height: orbSize,
                  borderRadius: orbSize / 2,
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  shadowColor: accentColor,
                },
              ]}>
              <Icon color={accentColor} size={iconSize} strokeWidth={2} />
            </View>
          </View>

          <Text
            style={{
              color: theme.colors.textMuted,
              fontSize: theme.typography.caption,
              fontWeight: '700',
              letterSpacing: 0.8,
              textTransform: 'uppercase',
              marginTop: theme.spacing['3xl'],
              marginBottom: theme.spacing.sm,
            }}>
            {safeIndex + 1} / {STEPS.length}
          </Text>

          <Text
            accessibilityRole="header"
            style={{
              color: theme.colors.textPrimary,
              fontSize: Math.min(theme.typography.h2, width * 0.075),
              fontWeight: '800',
              letterSpacing: -0.6,
              textAlign: 'center',
              lineHeight: 36,
              marginBottom: theme.spacing.md,
              maxWidth: 340,
            }}>
            {step.headline}
          </Text>

          <Text
            style={{
              color: theme.colors.textSecondary,
              fontSize: theme.typography.bodyLarge,
              lineHeight: 26,
              textAlign: 'center',
              maxWidth: 320,
            }}>
            {step.body}
          </Text>
        </Animated.View>

        <View style={styles.dots}>
          {STEPS.map((_, i) => (
            <View
              key={ONBOARDING_PERMISSIONS[i]}
              accessibilityLabel={
                i === safeIndex ? `Étape ${i + 1} active` : `Étape ${i + 1}`
              }
              style={{
                width: i === safeIndex ? 22 : 7,
                height: 7,
                borderRadius: 4,
                backgroundColor:
                  i === safeIndex ? accentColor : theme.colors.border,
              }}
            />
          ))}
        </View>

        <View style={styles.actions}>
          <Button
            label={step.cta}
            onPress={() => {
              void onAllow();
            }}
            loading={busy}
          />
          <Button
            label="Plus tard"
            variant="ghost"
            onPress={onLater}
            style={{marginTop: 10}}
            disabled={busy}
          />
        </View>
      </View>
    </BrandBackground>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1},
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  orbOuter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbInner: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: {width: 0, height: 10},
    elevation: 6,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  actions: {
    paddingTop: 4,
  },
});
