import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../../../theme/ThemeProvider';
import {BrandLogo} from '../../../components/brand/BrandLogo';

/**
 * Splash de bootstrap responsive (pas d’image marketing full-bleed).
 * Visible tant que `hydrate()` n’a pas terminé.
 */
export function SplashScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const {width} = useWindowDimensions();
  const logoSize = Math.round(Math.min(120, Math.max(72, width * 0.28)));

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: theme.colors.background,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
      accessibilityLabel="Chargement AfrikaTrans">
      <View style={styles.content}>
        <BrandLogo variant="icon" size={logoSize} plate="plain" />
        <Text
          style={[
            styles.brand,
            {
              color: theme.colors.brandPrimary,
              fontSize: Math.min(28, width * 0.07),
            },
          ]}>
          Afrika
          <Text style={{color: theme.colors.brandAccent}}>Trans</Text>
        </Text>
        <Text
          style={[
            styles.tagline,
            {
              color: theme.colors.textSecondary,
              maxWidth: Math.min(320, width - 64),
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
  root: {flex: 1},
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  brand: {
    marginTop: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  tagline: {
    marginTop: 12,
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
  spinner: {marginTop: 28},
});
