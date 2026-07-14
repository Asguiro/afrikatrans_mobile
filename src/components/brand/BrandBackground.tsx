import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
} from 'react-native';
import {backgrounds} from '../../assets';
import {useTheme} from '../../theme/ThemeProvider';

type Variant = 'world' | 'africa' | 'none';

type Props = {
  children: React.ReactNode;
  variant?: Variant;
  overlayOpacity?: number;
  style?: StyleProp<ViewStyle>;
};

export function BrandBackground({
  children,
  variant = 'africa',
  overlayOpacity = 0.12,
  style,
}: Props) {
  const theme = useTheme();

  if (variant === 'none') {
    return (
      <View
        style={[
          styles.flex,
          {backgroundColor: theme.colors.background},
          style,
        ]}>
        {children}
      </View>
    );
  }

  const source = theme.isDark
    ? backgrounds.africaNetworkDark
    : variant === 'world'
      ? backgrounds.worldLight
      : backgrounds.africaNetworkLight;

  return (
    <ImageBackground
      source={source}
      style={[styles.flex, style]}
      resizeMode="cover"
      accessibilityIgnoresInvertColors>
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: theme.isDark
              ? `rgba(11, 18, 32, ${overlayOpacity + 0.25})`
              : `rgba(246, 248, 252, ${overlayOpacity})`,
          },
        ]}
      />
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1},
});
