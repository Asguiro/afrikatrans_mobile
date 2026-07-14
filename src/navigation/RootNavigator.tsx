import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {RootStackParamList, OnboardingStackParamList} from './types';
import {SplashScreen} from '../features/onboarding/screens/SplashScreen';
import {OnboardingScreen} from '../features/onboarding/screens/OnboardingScreen';
import {AppLockScreen} from '../features/auth/screens/AppLockScreen';
import {AuthNavigator} from './AuthNavigator';
import {AppNavigator} from './AppNavigator';
import {useSessionStore} from '../stores/sessionStore';
import {usePreferencesStore} from '../stores/preferencesStore';
import {useTheme} from '../theme/ThemeProvider';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const OnboardingStack =
  createNativeStackNavigator<OnboardingStackParamList>();

function OnboardingNavigator() {
  return (
    <OnboardingStack.Navigator screenOptions={{headerShown: false}}>
      <OnboardingStack.Screen name="Onboarding" component={OnboardingScreen} />
    </OnboardingStack.Navigator>
  );
}

export function RootNavigator() {
  const theme = useTheme();
  const isAuthenticated = useSessionStore(s => s.isAuthenticated);
  const isAppLocked = useSessionStore(s => s.isAppLocked);
  const isHydrated = useSessionStore(s => s.isHydrated);
  const onboardingCompleted = usePreferencesStore(s => s.onboardingCompleted);

  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: theme.colors.background},
        animation: 'fade',
      }}>
      {!isHydrated ? (
        <RootStack.Screen name="Splash" component={SplashScreen} />
      ) : isAuthenticated && isAppLocked ? (
        <RootStack.Screen name="AppLock" component={AppLockScreen} />
      ) : isAuthenticated ? (
        <RootStack.Screen name="App" component={AppNavigator} />
      ) : !onboardingCompleted ? (
        <>
          <RootStack.Screen name="Onboarding" component={OnboardingNavigator} />
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        </>
      ) : (
        <RootStack.Screen name="Auth" component={AuthNavigator} />
      )}
    </RootStack.Navigator>
  );
}
