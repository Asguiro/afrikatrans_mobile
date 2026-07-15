import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {TransferStackParamList} from './types';
import {
  AmountScreen,
  TransferReviewScreen,
  ProcessingScreen,
  SuccessScreen,
  ReceiptScreen,
} from '../features/transfer/screens/TransferFlowScreens';
import {useTheme} from '../theme/ThemeProvider';

const Stack = createNativeStackNavigator<TransferStackParamList>();

export function TransferNavigator() {
  const theme = useTheme();
  return (
    <Stack.Navigator
      initialRouteName="Amount"
      screenOptions={{
        headerTintColor: theme.colors.brandPrimary,
        headerStyle: {backgroundColor: theme.colors.background},
        contentStyle: {backgroundColor: theme.colors.background},
      }}>
      <Stack.Screen
        name="Amount"
        component={AmountScreen}
        options={{title: 'Montant'}}
      />
      <Stack.Screen
        name="Review"
        component={TransferReviewScreen}
        options={{title: 'Récapitulatif'}}
      />
      <Stack.Screen
        name="Processing"
        component={ProcessingScreen}
        options={{title: 'Envoi', headerBackVisible: false}}
      />
      <Stack.Screen
        name="Success"
        component={SuccessScreen}
        options={{title: 'Reçu', headerBackVisible: false}}
      />
      <Stack.Screen
        name="Receipt"
        component={ReceiptScreen}
        options={{title: 'Reçu'}}
      />
    </Stack.Navigator>
  );
}
