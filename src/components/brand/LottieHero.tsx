import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import LottieView from 'lottie-react-native';
import {lottieAssets} from '../../assets';

export type LottieHeroName = keyof typeof lottieAssets;

type Props = {
  name: LottieHeroName;
  size?: number;
  loop?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function LottieHero({
  name,
  size = 220,
  loop = true,
  style,
}: Props) {
  return (
    <View
      style={[styles.wrap, {width: size, height: size}, style]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants">
      <LottieView
        source={lottieAssets[name]}
        autoPlay
        loop={loop}
        style={{width: size, height: size}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
