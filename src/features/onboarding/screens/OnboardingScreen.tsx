import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {OnboardingStackParamList} from '../../../navigation/types';
import {Button} from '../../../components/ui/Button';
import {BrandBackground} from '../../../components/brand/BrandBackground';
import {BrandLogo} from '../../../components/brand/BrandLogo';
import {
  LottieHero,
  type LottieHeroName,
} from '../../../components/brand/LottieHero';
import {useTheme} from '../../../theme/ThemeProvider';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Onboarding'>;

const slides: Array<{
  title: string;
  body: string;
  lottie: LottieHeroName;
  bg: 'africa' | 'world';
}> = [
  {
    title: 'Transferts interopérables',
    body: 'Envoyez entre opérateurs Mobile Money en toute clarté.',
    lottie: 'transferFlow',
    bg: 'africa',
  },
  {
    title: 'Frais transparents',
    body: 'Consultez le devis avant de confirmer — aucune surprise.',
    lottie: 'networkOrbit',
    bg: 'world',
  },
  {
    title: 'Suivi en temps réel',
    body: 'Statut, reçu et historique centralisés dans l’app.',
    lottie: 'securePulse',
    bg: 'africa',
  },
];

export function OnboardingScreen({navigation}: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const slide = slides[index];

  const goToPermissions = () => {
    navigation.navigate('Permissions');
  };

  return (
    <BrandBackground variant={slide.bg} overlayOpacity={0.55}>
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
        <View style={styles.hero}>
          <LottieHero name={slide.lottie} size={240} />
        </View>
        <Text
          accessibilityRole="header"
          style={{
            color: theme.colors.textPrimary,
            fontSize: theme.typography.h3,
            fontWeight: '700',
            marginBottom: theme.spacing.sm,
          }}>
          {slide.title}
        </Text>
        <Text
          style={{
            color: theme.colors.textSecondary,
            fontSize: theme.typography.bodyLarge,
            lineHeight: 26,
            marginBottom: theme.spacing['2xl'],
          }}>
          {slide.body}
        </Text>
        <View style={styles.dots}>
          {slides.map((_, i) => (
            <View
              key={i}
              accessibilityLabel={
                i === index ? `Étape ${i + 1} active` : `Étape ${i + 1}`
              }
              style={{
                width: i === index ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor:
                  i === index
                    ? theme.colors.brandAccent
                    : theme.colors.border,
              }}
            />
          ))}
        </View>
        <View style={styles.actions}>
          {index < slides.length - 1 ? (
            <Button label="Suivant" onPress={() => setIndex(i => i + 1)} />
          ) : (
            <Button label="Commencer" onPress={goToPermissions} />
          )}
          <Button
            label="Passer"
            variant="ghost"
            onPress={goToPermissions}
            style={{marginTop: 12}}
          />
        </View>
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
    minHeight: 220,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  actions: {marginTop: 'auto'},
});
