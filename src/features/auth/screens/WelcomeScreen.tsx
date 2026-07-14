import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {AuthStackParamList} from '../../../navigation/types';
import {Button} from '../../../components/ui/Button';
import {BrandBackground} from '../../../components/brand/BrandBackground';
import {BrandLogo} from '../../../components/brand/BrandLogo';
import {LottieHero} from '../../../components/brand/LottieHero';
import {useTheme} from '../../../theme/ThemeProvider';

type Props = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;

export function WelcomeScreen({navigation}: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <BrandBackground variant="africa" overlayOpacity={0.5}>
      <View
        style={[
          styles.container,
          {
            paddingTop: Math.max(insets.top, 20),
            paddingBottom: Math.max(insets.bottom, 20),
            paddingHorizontal: theme.spacing['2xl'],
          },
        ]}>
        <BrandLogo variant="icon" size={96} plate="plain" showTagline />
        <View style={styles.hero}>
          <LottieHero name="networkOrbit" size={200} />
        </View>
        <Text
          accessibilityRole="header"
          style={{
            color: theme.colors.textPrimary,
            fontSize: theme.typography.h2,
            fontWeight: '800',
            letterSpacing: -0.4,
            marginBottom: theme.spacing.sm,
          }}>
          Bienvenue
        </Text>
        <Text
          style={{
            color: theme.colors.textSecondary,
            fontSize: theme.typography.body,
            lineHeight: 22,
            marginBottom: theme.spacing['2xl'],
          }}>
          Transferts Mobile Money panafricains, simples et sécurisés.
        </Text>
        <Button
          label="Créer un compte"
          onPress={() => navigation.navigate('Register')}
        />
        <Button
          label="Se connecter"
          variant="secondary"
          onPress={() => navigation.navigate('Login')}
          style={{marginTop: 12}}
        />
      </View>
    </BrandBackground>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 160,
  },
});
