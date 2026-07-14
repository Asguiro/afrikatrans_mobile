import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {KycStackParamList} from './types';
import {
  KycIntroScreen,
  KycPersonalInfoScreen,
  KycDocumentScreen,
  KycSelfieScreen,
  KycStatusScreen,
} from '../features/kyc/screens/KycScreens';
import {useTheme} from '../theme/ThemeProvider';

const Stack = createNativeStackNavigator<KycStackParamList>();

export function KycNavigator() {
  const theme = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: theme.colors.brandPrimary,
        headerStyle: {backgroundColor: theme.colors.background},
        contentStyle: {backgroundColor: theme.colors.background},
      }}>
      <Stack.Screen
        name="KycIntro"
        component={KycIntroScreen}
        options={{title: 'KYC'}}
      />
      <Stack.Screen
        name="KycPersonalInfo"
        component={KycPersonalInfoScreen}
        options={{title: 'Identité'}}
      />
      <Stack.Screen
        name="KycDocument"
        component={KycDocumentScreen}
        options={{title: 'Document'}}
      />
      <Stack.Screen
        name="KycSelfie"
        component={KycSelfieScreen}
        options={{title: 'Selfie'}}
      />
      <Stack.Screen
        name="KycStatus"
        component={KycStatusScreen}
        options={{title: 'Statut'}}
      />
    </Stack.Navigator>
  );
}
