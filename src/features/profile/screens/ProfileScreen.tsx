import React from 'react';
import {Pressable, Text, View} from 'react-native';
import type {CompositeScreenProps} from '@react-navigation/native';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  Shield,
  Palette,
  BadgeCheck,
  LogOut,
  ChevronRight,
  UserRound,
} from 'lucide-react-native';
import type {
  AppStackParamList,
  AppTabParamList,
} from '../../../navigation/types';
import {Screen} from '../../../components/ui/Screen';
import {
  Avatar,
  IconBubble,
  ListGroup,
  ListRow,
  StatusChip,
} from '../../../components/ui/ListRow';
import {useSessionStore} from '../../../stores/sessionStore';
import {useTheme} from '../../../theme/ThemeProvider';
import {formatStatus} from '../../../utils/format';
import {usePreferencesStore} from '../../../stores/preferencesStore';

type Props = CompositeScreenProps<
  BottomTabScreenProps<AppTabParamList, 'ProfileTab'>,
  NativeStackScreenProps<AppStackParamList>
>;

function kycTone(
  status?: string,
): 'success' | 'warning' | 'error' | 'info' | 'neutral' {
  switch (status) {
    case 'APPROVED':
      return 'success';
    case 'PENDING':
    case 'IN_REVIEW':
      return 'info';
    case 'REJECTED':
    case 'NEEDS_RESUBMISSION':
      return 'error';
    case 'NONE':
      return 'warning';
    default:
      return 'neutral';
  }
}

export function ProfileScreen({navigation}: Props) {
  const theme = useTheme();
  const user = useSessionStore(s => s.user);
  const signOut = useSessionStore(s => s.signOut);
  const biometricEnabled = usePreferencesStore(s => s.biometricEnabled);
  const appearance = usePreferencesStore(s => s.appearance);
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ');

  const appearanceLabel =
    appearance === 'system'
      ? 'Système'
      : appearance === 'dark'
        ? 'Sombre'
        : 'Clair';

  return (
    <Screen>
      <Text
        style={{
          color: theme.colors.textMuted,
          fontSize: theme.typography.caption,
          fontWeight: '700',
          letterSpacing: 0.6,
          textTransform: 'uppercase',
          marginBottom: 8,
        }}>
        Compte
      </Text>
      <Text
        accessibilityRole="header"
        style={{
          color: theme.colors.textPrimary,
          fontSize: theme.typography.h3,
          fontWeight: '800',
          marginBottom: theme.spacing.xl,
        }}>
        Profil
      </Text>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Voir et modifier les informations personnelles"
        onPress={() => navigation.navigate('EditProfile')}
        style={({pressed}) => ({
          opacity: pressed ? 0.9 : 1,
          backgroundColor: theme.colors.brandPrimary,
          borderRadius: theme.radius.xl,
          padding: theme.spacing['2xl'],
          marginBottom: theme.spacing['2xl'],
          flexDirection: 'row',
          alignItems: 'center',
          gap: 16,
        })}>
        <View
          style={{
            borderWidth: 3,
            borderColor: theme.colors.onBrandPrimary,
            borderRadius: 35,
          }}>
          <Avatar
            name={fullName || 'AT'}
            size={64}
            imageUri={user?.avatarUrl}
          />
        </View>
        <View style={{flex: 1}}>
          <Text
            style={{
              color: theme.colors.onBrandPrimary,
              fontWeight: '800',
              fontSize: theme.typography.bodyLarge,
            }}>
            {fullName || 'Utilisateur'}
          </Text>
          <Text
            style={{
              color: theme.colors.onBrandPrimary,
              opacity: 0.75,
              marginTop: 4,
              fontSize: theme.typography.bodySmall,
            }}>
            {user?.phone}
          </Text>
          <View style={{marginTop: 10}}>
            <StatusChip
              label={`KYC · ${formatStatus(user?.kycStatus ?? 'NONE')}`}
              tone={kycTone(user?.kycStatus)}
            />
          </View>
        </View>
        <ChevronRight color={theme.colors.onBrandPrimary} size={20} />
      </Pressable>

      <ListGroup title="Compte">
        <ListRow
          label="Informations personnelles"
          subtitle="Nom, e-mail et photo de profil"
          onPress={() => navigation.navigate('EditProfile')}
          leading={
            <IconBubble>
              <UserRound
                color={theme.colors.brandPrimary}
                size={18}
                strokeWidth={2}
              />
            </IconBubble>
          }
          trailing={
            <ChevronRight color={theme.colors.textMuted} size={18} />
          }
          last
        />
      </ListGroup>

      <ListGroup title="Préférences">
        <ListRow
          label="Sécurité"
          subtitle={
            biometricEnabled
              ? 'Mot de passe, PIN et biométrie'
              : 'Mot de passe, PIN · biométrie off'
          }
          onPress={() => navigation.navigate('Security')}
          leading={
            <IconBubble>
              <Shield color={theme.colors.brandPrimary} size={18} strokeWidth={2} />
            </IconBubble>
          }
          trailing={
            <ChevronRight color={theme.colors.textMuted} size={18} />
          }
        />
        <ListRow
          label="Apparence"
          value={appearanceLabel}
          onPress={() => navigation.navigate('Appearance')}
          leading={
            <IconBubble soft={theme.colors.brandAccentSoft}>
              <Palette color={theme.colors.warning} size={18} strokeWidth={2} />
            </IconBubble>
          }
          trailing={
            <ChevronRight color={theme.colors.textMuted} size={18} />
          }
        />
        <ListRow
          label="Vérification d’identité"
          subtitle="Limites et documents KYC"
          onPress={() => navigation.navigate('Kyc')}
          leading={
            <IconBubble soft={theme.colors.successSoft}>
              <BadgeCheck
                color={theme.colors.success}
                size={18}
                strokeWidth={2}
              />
            </IconBubble>
          }
          trailing={
            <ChevronRight color={theme.colors.textMuted} size={18} />
          }
          last
        />
      </ListGroup>

      <ListGroup>
        <ListRow
          label="Se déconnecter"
          destructive
          onPress={() => {
            signOut().catch(() => undefined);
          }}
          leading={
            <IconBubble soft={theme.colors.errorSoft}>
              <LogOut color={theme.colors.error} size={18} strokeWidth={2} />
            </IconBubble>
          }
          last
        />
      </ListGroup>

      <Text
        style={{
          textAlign: 'center',
          color: theme.colors.textMuted,
          fontSize: 11,
          marginTop: 4,
        }}>
        AfrikaTrans · v0.0.1
      </Text>
    </Screen>
  );
}
