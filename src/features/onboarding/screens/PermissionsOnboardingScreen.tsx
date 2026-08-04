import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  Bell,
  Camera,
  Contact,
  Image as ImageIcon,
} from 'lucide-react-native';
import type {OnboardingStackParamList} from '../../../navigation/types';
import {Button} from '../../../components/ui/Button';
import {BrandBackground} from '../../../components/brand/BrandBackground';
import {BrandLogo} from '../../../components/brand/BrandLogo';
import {useTheme} from '../../../theme/ThemeProvider';
import {usePreferencesStore} from '../../../stores/preferencesStore';
import {useAppPermissions} from '../../../hooks/useAppPermissions';
import {
  ONBOARDING_PERMISSIONS,
  PERMISSION_COPY,
} from '../../../permissions/types';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Permissions'>;

const ICONS = {
  notifications: Bell,
  contacts: Contact,
  camera: Camera,
  photoLibrary: ImageIcon,
} as const;

export function PermissionsOnboardingScreen({navigation}: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const setOnboardingCompleted = usePreferencesStore(
    s => s.setOnboardingCompleted,
  );
  const setPermissionsOnboardingSeen = usePreferencesStore(
    s => s.setPermissionsOnboardingSeen,
  );
  const {requestOnboarding, busy} = useAppPermissions();
  const [error, setError] = useState<string | null>(null);

  const finish = () => {
    setPermissionsOnboardingSeen(true);
    setOnboardingCompleted(true);
    navigation.getParent()?.navigate('Auth');
  };

  const activate = async () => {
    setError(null);
    try {
      await requestOnboarding();
      finish();
    } catch {
      setError('Impossible de demander les autorisations pour le moment.');
    }
  };

  return (
    <BrandBackground variant="africa" overlayOpacity={0.55}>
      <View
        style={[
          styles.container,
          {
            paddingTop: Math.max(insets.top, 16),
            paddingBottom: Math.max(insets.bottom, 20),
            paddingHorizontal: theme.spacing['2xl'],
          },
        ]}>
        <BrandLogo variant="horizontal" size={48} plate="plain" />
        <Text
          accessibilityRole="header"
          style={{
            color: theme.colors.textPrimary,
            fontSize: theme.typography.h3,
            fontWeight: '700',
            marginTop: theme.spacing['2xl'],
            marginBottom: theme.spacing.sm,
          }}>
          Autorisations
        </Text>
        <Text
          style={{
            color: theme.colors.textSecondary,
            fontSize: theme.typography.bodyLarge,
            lineHeight: 26,
            marginBottom: theme.spacing['2xl'],
          }}>
          Activez ces accès pour une expérience fluide — vous pourrez les
          modifier plus tard dans les réglages.
        </Text>

        <View style={{gap: theme.spacing.lg, flex: 1}}>
          {ONBOARDING_PERMISSIONS.map(permission => {
            const Icon = ICONS[permission];
            const copy = PERMISSION_COPY[permission];
            return (
              <View
                key={permission}
                style={[
                  styles.row,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                    borderRadius: theme.radius.lg,
                    padding: theme.spacing.lg,
                  },
                ]}>
                <View
                  style={[
                    styles.iconWrap,
                    {backgroundColor: theme.colors.brandPrimarySoft},
                  ]}>
                  <Icon
                    color={theme.colors.brandPrimary}
                    size={22}
                    strokeWidth={2.2}
                  />
                </View>
                <View style={{flex: 1}}>
                  <Text
                    style={{
                      color: theme.colors.textPrimary,
                      fontWeight: '700',
                      fontSize: theme.typography.body,
                      marginBottom: 4,
                    }}>
                    {copy.title}
                  </Text>
                  <Text
                    style={{
                      color: theme.colors.textSecondary,
                      fontSize: theme.typography.bodySmall,
                      lineHeight: 20,
                    }}>
                    {copy.benefit}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {error ? (
          <Text
            style={{
              color: theme.colors.error,
              marginBottom: theme.spacing.md,
              fontSize: theme.typography.bodySmall,
            }}>
            {error}
          </Text>
        ) : null}

        <View style={styles.actions}>
          <Button
            label="Activer les autorisations"
            onPress={() => {
              void activate();
            }}
            loading={busy}
          />
          <Button
            label="Plus tard"
            variant="ghost"
            onPress={finish}
            style={{marginTop: 12}}
            disabled={busy}
          />
        </View>
      </View>
    </BrandBackground>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    borderWidth: 1,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {marginTop: 'auto', paddingTop: 16},
});
