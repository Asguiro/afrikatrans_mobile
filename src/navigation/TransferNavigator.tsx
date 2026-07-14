import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {TransferStackParamList} from './types';
import {
  SelectOperatorScreen,
  TransferPhonesScreen,
  AmountScreen,
  QuoteScreen,
  ConfirmTransferPinScreen,
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
      screenOptions={{
        headerTintColor: theme.colors.brandPrimary,
        headerStyle: {backgroundColor: theme.colors.background},
        contentStyle: {backgroundColor: theme.colors.background},
      }}>
      <Stack.Screen
        name="SelectOperator"
        component={SelectOperatorScreen}
        options={{title: 'Envoyer'}}
      />
      <Stack.Screen
        name="TransferPhones"
        component={TransferPhonesScreen}
        options={{title: 'Numéros'}}
      />
      <Stack.Screen
        name="Amount"
        component={AmountScreen}
        options={{title: 'Montant'}}
      />
      <Stack.Screen
        name="Quote"
        component={QuoteScreen}
        options={{title: 'Devis'}}
      />
      <Stack.Screen
        name="ConfirmPin"
        component={ConfirmTransferPinScreen}
        options={{title: 'PIN'}}
      />
      <Stack.Screen
        name="Processing"
        component={ProcessingScreen}
        options={{title: 'Traitement', headerBackVisible: false}}
      />
      <Stack.Screen
        name="Success"
        component={SuccessScreen}
        options={{title: 'Résultat', headerBackVisible: false}}
      />
      <Stack.Screen
        name="Receipt"
        component={ReceiptScreen}
        options={{title: 'Reçu'}}
      />
    </Stack.Navigator>
  );
}
