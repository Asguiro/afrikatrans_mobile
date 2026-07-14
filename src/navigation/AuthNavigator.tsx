import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {AuthStackParamList} from './types';
import {WelcomeScreen} from '../features/auth/screens/WelcomeScreen';
import {SelectCountryScreen} from '../features/auth/screens/SelectCountryScreen';
import {RegisterScreen} from '../features/auth/screens/RegisterScreen';
import {VerifyOtpScreen} from '../features/auth/screens/VerifyOtpScreen';
import {CreatePinScreen} from '../features/auth/screens/CreatePinScreen';
import {ConfirmPinScreen} from '../features/auth/screens/ConfirmPinScreen';
import {LoginScreen} from '../features/auth/screens/LoginScreen';
import {
  ForgotPasswordScreen,
  SessionExpiredScreen,
} from '../features/auth/screens/ForgotPasswordScreen';
import {useTheme} from '../theme/ThemeProvider';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  const theme = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: theme.colors.brandPrimary,
        headerStyle: {backgroundColor: theme.colors.background},
        contentStyle: {backgroundColor: theme.colors.background},
      }}>
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SelectCountry"
        component={SelectCountryScreen}
        options={{title: 'Pays'}}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{title: 'Inscription'}}
      />
      <Stack.Screen
        name="VerifyOtp"
        component={VerifyOtpScreen}
        options={{title: 'OTP'}}
      />
      <Stack.Screen
        name="CreatePin"
        component={CreatePinScreen}
        options={{title: 'PIN'}}
      />
      <Stack.Screen
        name="ConfirmPin"
        component={ConfirmPinScreen}
        options={{title: 'Confirmer PIN'}}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{title: 'Connexion'}}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{title: 'Mot de passe'}}
      />
      <Stack.Screen
        name="SessionExpired"
        component={SessionExpiredScreen}
        options={{title: 'Session'}}
      />
    </Stack.Navigator>
  );
}
