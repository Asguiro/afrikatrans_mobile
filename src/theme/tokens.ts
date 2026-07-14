import {ColorSchemeName} from 'react-native';

const lightColors = {
  brandPrimary: '#0A2E63',
  brandPrimaryHover: '#082650',
  brandPrimarySoft: '#EAF2FF',
  /** Texte / icônes sur fond `brandPrimary` (CTA, hero, chips). */
  onBrandPrimary: '#FFFFFF',
  brandAccent: '#F5B700',
  brandAccentHover: '#DFA600',
  brandAccentSoft: '#FFF7D6',
  background: '#F6F8FC',
  surface: '#FFFFFF',
  surfaceRaised: '#FFFFFF',
  textPrimary: '#10213A',
  textSecondary: '#5C6B80',
  textMuted: '#8793A5',
  border: '#DCE3ED',
  divider: '#E9EDF3',
  success: '#168A4A',
  successSoft: '#E7F7EE',
  warning: '#B36B00',
  warningSoft: '#FFF3DF',
  error: '#C63C3C',
  errorSoft: '#FDECEC',
  /** Texte sur fond `error` plein. */
  onError: '#FFFFFF',
  info: '#1677B8',
  infoSoft: '#E9F5FC',
} as const;

const darkColors = {
  brandPrimary: '#7FB3FF',
  brandPrimaryHover: '#9AC3FF',
  brandPrimarySoft: '#102745',
  /** Texte sombre sur primary clair → contraste AA sur CTAs dark. */
  onBrandPrimary: '#0B1220',
  brandAccent: '#FFC83D',
  brandAccentHover: '#FFD66B',
  brandAccentSoft: '#3A300F',
  background: '#0B1220',
  surface: '#111B2E',
  surfaceRaised: '#172338',
  textPrimary: '#F4F7FB',
  textSecondary: '#A8B4C5',
  textMuted: '#7E8B9E',
  border: '#2A3951',
  divider: '#233148',
  success: '#55D68A',
  successSoft: '#123524',
  warning: '#FFBC55',
  warningSoft: '#3A2A12',
  error: '#FF7D7D',
  errorSoft: '#3C1A1A',
  onError: '#0B1220',
  info: '#63B8EE',
  infoSoft: '#102E40',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
} as const;

export const typography = {
  caption: 12,
  bodySmall: 14,
  body: 16,
  bodyLarge: 18,
  h4: 20,
  h3: 24,
  h2: 30,
  h1: 36,
} as const;

export const controlHeights = {
  small: 36,
  medium: 44,
  large: 52,
} as const;

export type ThemeColors = {
  brandPrimary: string;
  brandPrimaryHover: string;
  brandPrimarySoft: string;
  onBrandPrimary: string;
  brandAccent: string;
  brandAccentHover: string;
  brandAccentSoft: string;
  background: string;
  surface: string;
  surfaceRaised: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  divider: string;
  success: string;
  successSoft: string;
  warning: string;
  warningSoft: string;
  error: string;
  errorSoft: string;
  onError: string;
  info: string;
  infoSoft: string;
};

export type AppTheme = {
  colors: ThemeColors;
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
  controlHeights: typeof controlHeights;
  isDark: boolean;
};

export function getTheme(scheme: ColorSchemeName): AppTheme {
  const isDark = scheme === 'dark';
  return {
    colors: isDark ? darkColors : lightColors,
    spacing,
    radius,
    typography,
    controlHeights,
    isDark,
  };
}
