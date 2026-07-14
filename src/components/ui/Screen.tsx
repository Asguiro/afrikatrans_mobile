import React, {useEffect, useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import {HeaderHeightContext} from '@react-navigation/elements';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../../theme/ThemeProvider';
import {OfflineBanner} from '../feedback/OfflineBanner';

type Props = {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  scroll?: boolean;
  style?: ViewStyle;
  /** Centre le contenu verticalement (ex. écran de verrouillage). */
  centered?: boolean;
  /** Masque la bannière offline (écrans plein écran type lock). */
  hideOfflineBanner?: boolean;
  /** Fond transparent (ex. par-dessus BrandBackground). */
  transparent?: boolean;
};

export function Screen({
  children,
  title,
  subtitle,
  scroll = true,
  style,
  centered = false,
  hideOfflineBanner = false,
  transparent = false,
}: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const headerHeight = React.useContext(HeaderHeightContext) ?? 0;
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSub = Keyboard.addListener(showEvent, () => {
      setKeyboardVisible(true);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardVisible(false);
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // Avec un header de stack, on décale iOS. Sur Android, adjustResize + padding.
  const keyboardVerticalOffset =
    Platform.OS === 'ios' ? Math.max(headerHeight, insets.top) : 0;

  const content = (
    <View
      style={[
        styles.inner,
        centered && !keyboardVisible && styles.centeredInner,
        {
          paddingTop: centered
            ? theme.spacing.lg
            : Math.max(insets.top, 12),
          paddingBottom: Math.max(insets.bottom, 16),
          paddingHorizontal: theme.spacing['2xl'],
        },
        style,
      ]}>
      {hideOfflineBanner ? null : <OfflineBanner />}
      {title ? (
        <Text
          accessibilityRole="header"
          style={{
            color: theme.colors.textPrimary,
            fontSize: theme.typography.h4,
            fontWeight: '800',
            marginBottom: subtitle ? theme.spacing.sm : theme.spacing.xl,
            letterSpacing: -0.2,
            textAlign: centered ? 'center' : 'left',
          }}>
          {title}
        </Text>
      ) : null}
      {subtitle ? (
        <Text
          style={{
            color: theme.colors.textSecondary,
            fontSize: theme.typography.bodySmall,
            marginBottom: theme.spacing.xl,
            lineHeight: 20,
            textAlign: centered ? 'center' : 'left',
          }}>
          {subtitle}
        </Text>
      ) : null}
      {children}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[
        styles.flex,
        {
          backgroundColor: transparent
            ? 'transparent'
            : theme.colors.background,
        },
      ]}
      // iOS : padding. Android : adjustResize natif (AndroidManifest) + décentrage au clavier.
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={keyboardVerticalOffset}>
      {scroll ? (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
          contentContainerStyle={[
            styles.grow,
            centered && !keyboardVisible && styles.centeredScroll,
            keyboardVisible && styles.keyboardOpenScroll,
          ]}
          showsVerticalScrollIndicator={false}>
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  grow: {flexGrow: 1},
  centeredScroll: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  keyboardOpenScroll: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingBottom: 24,
  },
  inner: {flexGrow: 1},
  centeredInner: {
    justifyContent: 'center',
  },
});
