import React from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useTheme} from '../../../theme/ThemeProvider';
import {splash as splashAssets} from '../../../assets';
import {BrandLogo} from '../../../components/brand/BrandLogo';

/**
 * Splash de bootstrap : visible tant que `hydrate()` n’a pas terminé.
 * Marque via `BrandLogo` (`logo_light` / `logo_dark` PNG).
 */
export function SplashScreen() {
  const theme = useTheme();
  const splashSource = theme.isDark ? splashAssets.dark : splashAssets.light;

  return (
    <View style={styles.root} accessibilityLabel="Chargement AfrikaTrans">
      <Image
        source={splashSource}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
      />
      <View
        style={[
          styles.overlay,
          {
            backgroundColor: theme.isDark
              ? 'rgba(11, 18, 32, 0.45)'
              : 'rgba(10, 46, 99, 0.18)',
          },
        ]}
      />
      <View style={styles.content}>
        <BrandLogo variant="icon" size={112} plate="plain" />
        <Text
          style={[
            styles.tagline,
            {
            color: theme.isDark
              ? theme.colors.brandAccent
              : theme.colors.brandPrimary,
            },
          ]}>
          Transferts d'argent en Afrique,{'\n'}simplement et en toute sécurité
        </Text>
        <ActivityIndicator
          color={theme.colors.brandAccent}
          style={styles.spinner}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: '#0A2E63'},
  overlay: {...StyleSheet.absoluteFill},
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  tagline: {
    marginTop: 28,
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },
  spinner: {marginTop: 36},
});
