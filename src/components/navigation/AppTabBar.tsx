import React from 'react';
import {Platform, Pressable, StyleSheet, Text, View} from 'react-native';
import type {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  House,
  ArrowLeftRight,
  ContactRound,
  Headset,
  CircleUserRound,
} from 'lucide-react-native';
import {useTheme} from '../../theme/ThemeProvider';
import type {AppTabParamList} from '../../navigation/types';

const LABELS: Record<keyof AppTabParamList, string> = {
  HomeTab: 'Accueil',
  ActivityTab: 'Historique',
  BeneficiariesTab: 'Contacts',
  SupportTab: 'Support',
  ProfileTab: 'Profil',
};

function TabGlyph({
  route,
  color,
  focused,
}: {
  route: keyof AppTabParamList;
  color: string;
  focused: boolean;
}) {
  const stroke = focused ? 2.25 : 1.75;
  const size = 22;
  switch (route) {
    case 'HomeTab':
      return <House color={color} size={size} strokeWidth={stroke} />;
    case 'ActivityTab':
      return <ArrowLeftRight color={color} size={size} strokeWidth={stroke} />;
    case 'BeneficiariesTab':
      return <ContactRound color={color} size={size} strokeWidth={stroke} />;
    case 'SupportTab':
      return <Headset color={color} size={size} strokeWidth={stroke} />;
    case 'ProfileTab':
      return <CircleUserRound color={color} size={size} strokeWidth={stroke} />;
    default:
      return null;
  }
}

export function AppTabBar({state, descriptors, navigation}: BottomTabBarProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 10);

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrap, {paddingBottom: bottomPad}]}>
      <View
        style={[
          styles.bar,
          {
            backgroundColor: theme.isDark
              ? 'rgba(17, 27, 46, 0.94)'
              : 'rgba(255, 255, 255, 0.96)',
            borderColor: theme.colors.border,
            shadowColor: theme.isDark ? '#000' : theme.colors.brandPrimary,
          },
        ]}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const {options} = descriptors[route.key];
          const label =
            LABELS[route.name as keyof AppTabParamList] ??
            options.title ??
            route.name;
          const color = focused
            ? theme.colors.brandPrimary
            : theme.colors.textMuted;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={{selected: focused}}
              accessibilityLabel={label}
              onPress={onPress}
              style={styles.item}>
              <View
                style={[
                  styles.iconWrap,
                  focused && {
                    backgroundColor: theme.colors.brandPrimarySoft,
                  },
                ]}>
                <TabGlyph
                  route={route.name as keyof AppTabParamList}
                  color={color}
                  focused={focused}
                />
              </View>
              <Text
                numberOfLines={1}
                style={{
                  marginTop: 4,
                  fontSize: 10,
                  fontWeight: focused ? '700' : '500',
                  color,
                  letterSpacing: 0.1,
                }}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 14,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 6,
    paddingVertical: 8,
    ...Platform.select({
      ios: {
        shadowOpacity: 0.12,
        shadowRadius: 18,
        shadowOffset: {width: 0, height: 8},
      },
      android: {
        elevation: 10,
      },
    }),
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  iconWrap: {
    width: 40,
    height: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
