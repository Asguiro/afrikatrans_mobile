import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {AppStackParamList} from './types';
import {AppTabsNavigator} from './AppTabsNavigator';
import {TransferNavigator} from './TransferNavigator';
import {KycNavigator} from './KycNavigator';
import {TransactionDetailScreen} from '../features/activity/screens/TransactionDetailScreen';
import {BeneficiaryFormScreen} from '../features/beneficiaries/screens/BeneficiaryFormScreen';
import {
  AppearanceScreen,
  SecurityScreen,
} from '../features/profile/screens/SettingsScreens';
import {useTheme} from '../theme/ThemeProvider';

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppNavigator() {
  const theme = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: theme.colors.brandPrimary,
        headerStyle: {backgroundColor: theme.colors.background},
        contentStyle: {backgroundColor: theme.colors.background},
      }}>
      <Stack.Screen
        name="Tabs"
        component={AppTabsNavigator}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Transfer"
        component={TransferNavigator}
        options={{headerShown: false, presentation: 'modal'}}
      />
      <Stack.Screen
        name="Kyc"
        component={KycNavigator}
        options={{headerShown: false, presentation: 'modal'}}
      />
      <Stack.Screen
        name="TransactionDetail"
        component={TransactionDetailScreen}
        options={{title: 'Transaction'}}
      />
      <Stack.Screen
        name="BeneficiaryForm"
        component={BeneficiaryFormScreen}
        options={{title: 'Bénéficiaire'}}
      />
      <Stack.Screen
        name="Appearance"
        component={AppearanceScreen}
        options={{title: 'Apparence'}}
      />
      <Stack.Screen
        name="Security"
        component={SecurityScreen}
        options={{title: 'Sécurité'}}
      />
    </Stack.Navigator>
  );
}
