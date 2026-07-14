import React from 'react';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {AuthStackParamList} from '../../../navigation/types';
import {Screen} from '../../../components/ui/Screen';
import {Button} from '../../../components/ui/Button';

type ForgotProps = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;
type SessionProps = NativeStackScreenProps<AuthStackParamList, 'SessionExpired'>;

export function ForgotPasswordScreen({navigation}: ForgotProps) {
  return (
    <Screen
      title="Mot de passe oublié"
      subtitle="En démo, reconnectez-vous avec Demo1234!.">
      <Button label="Retour à la connexion" onPress={() => navigation.goBack()} />
    </Screen>
  );
}

export function SessionExpiredScreen({navigation}: SessionProps) {
  return (
    <Screen
      title="Session expirée"
      subtitle="Pour votre sécurité, reconnectez-vous.">
      <Button label="Se reconnecter" onPress={() => navigation.navigate('Login')} />
    </Screen>
  );
}
