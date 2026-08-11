import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
} from 'react-native';
import {HeaderHeightContext} from '@react-navigation/elements';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../../theme/ThemeProvider';
import {OfflineBanner} from '../feedback/OfflineBanner';
import {KeyboardScrollContext} from './keyboardScrollContext';

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

/** Marge au-dessus du clavier pour laisser le champ focalisé lisible. */
const KEYBOARD_FIELD_GAP = 32;

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
  const scrollRef = useRef<ScrollView>(null);
  const scrollYRef = useRef(0);
  const keyboardTopRef = useRef(0);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const keyboardVisible = keyboardHeight > 0;

  const ensureFocusedInputVisible = useCallback(() => {
    if (!scroll) {
      return;
    }
    const keyboardTop = keyboardTopRef.current;
    if (keyboardTop <= 0) {
      return;
    }
    const focused = TextInput.State.currentlyFocusedInput();
    if (!focused || !scrollRef.current) {
      return;
    }
    focused.measureInWindow((_x, y, _w, height) => {
      const fieldBottom = y + height;
      if (fieldBottom + KEYBOARD_FIELD_GAP <= keyboardTop) {
        return;
      }
      const delta = fieldBottom + KEYBOARD_FIELD_GAP - keyboardTop;
      scrollRef.current?.scrollTo({
        y: Math.max(0, scrollYRef.current + delta),
        animated: true,
      });
    });
  }, [scroll]);

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSub = Keyboard.addListener(showEvent, event => {
      keyboardTopRef.current = event.endCoordinates.screenY;
      setKeyboardHeight(event.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      keyboardTopRef.current = 0;
      setKeyboardHeight(0);
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    if (!scroll || keyboardHeight <= 0) {
      return;
    }
    const timer = setTimeout(
      ensureFocusedInputVisible,
      Platform.OS === 'ios' ? 60 : 120,
    );
    return () => clearTimeout(timer);
  }, [ensureFocusedInputVisible, keyboardHeight, scroll]);

  const onInputFocus = useCallback(() => {
    requestAnimationFrame(() => {
      setTimeout(ensureFocusedInputVisible, Platform.OS === 'ios' ? 40 : 80);
    });
  }, [ensureFocusedInputVisible]);

  const keyboardScrollValue = useMemo(
    () => (scroll ? {onInputFocus} : null),
    [onInputFocus, scroll],
  );

  const keyboardVerticalOffset =
    Platform.OS === 'ios'
      ? Math.max(headerHeight, insets.top)
      : Math.max(headerHeight, 0);

  // Header stack = safe-area déjà géré — éviter le double padding.
  const topPadding =
    headerHeight > 0
      ? theme.spacing.lg
      : centered
        ? theme.spacing.lg
        : Math.max(insets.top, 12);

  const content = (
    <View
      style={[
        styles.inner,
        centered && !keyboardVisible && styles.centeredInner,
        {
          paddingTop: topPadding,
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

  const backgroundColor = transparent
    ? 'transparent'
    : theme.colors.background;

  const wrapped = (
    <KeyboardScrollContext.Provider value={keyboardScrollValue}>
      {content}
    </KeyboardScrollContext.Provider>
  );

  if (scroll) {
    // ScrollView : insets iOS + padding Android (adjustResize) + scroll vers le focus.
    // Pas de KeyboardAvoidingView ici pour éviter le double décalage avec le clavier système.
    return (
      <View style={[styles.flex, {backgroundColor}]}>
        <ScrollView
          ref={scrollRef}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
          scrollsChildToFocus
          scrollEventThrottle={16}
          onScroll={event => {
            scrollYRef.current = event.nativeEvent.contentOffset.y;
          }}
          contentContainerStyle={[
            styles.grow,
            centered && !keyboardVisible && styles.centeredScroll,
            keyboardVisible &&
              Platform.OS === 'android' && {
                paddingBottom: Math.max(Math.round(keyboardHeight * 0.4), 120),
              },
          ]}
          showsVerticalScrollIndicator={false}>
          {wrapped}
        </ScrollView>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.flex, {backgroundColor}]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={keyboardVerticalOffset}>
      {wrapped}
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
  inner: {flexGrow: 1},
  centeredInner: {
    justifyContent: 'center',
  },
});
