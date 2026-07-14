/**
 * Catalogue d’assets mobile AfrikaTrans.
 * Les visuels admin (`reference/admin`) restent hors UI mobile.
 */
export const logos = {
  light: require('./logos/logo_light.png'),
  dark: require('./logos/logo_dark.png'),
} as const;

export const operatorLogos = {
  wave: require('./logos/wave_logo.webp'),
  orange: require('./logos/Orange_Money_logo.png'),
  mtn: require('./logos/mtnmomo_logo.webp'),
  moov: require('./logos/moovmoney_logo.png'),
} as const;

export const splash = {
  light: require('./splash/splash-light.png'),
  dark: require('./splash/splash-dark.png'),
} as const;

export const backgrounds = {
  worldLight: require('./backgrounds/world-light.png'),
  africaNetworkLight: require('./backgrounds/africa-network-light.png'),
  africaNetworkDark: require('./backgrounds/africa-network-dark.png'),
} as const;

export const authAssets = {
  loginPreview: require('./auth/login-preview.png'),
} as const;

export const lottieAssets = {
  networkOrbit: require('./lottie/network-orbit.json'),
  securePulse: require('./lottie/secure-pulse.json'),
  transferFlow: require('./lottie/transfer-flow.json'),
} as const;
