import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {AuthStackParamList} from '../../../navigation/types';
import {Screen} from '../../../components/ui/Screen';
import {TextField} from '../../../components/ui/TextField';
import {Button} from '../../../components/ui/Button';
import {BrandLogo} from '../../../components/brand/BrandLogo';
import {loginSchema} from '../../../schemas/forms';
import {authApi} from '../../../services/api';
import {unwrap} from '../../../services/api/helpers';
import {useSessionStore} from '../../../stores/sessionStore';
import {useTheme} from '../../../theme/ThemeProvider';
import {useInputFocusChain} from '../../../hooks/useInputFocusChain';
import {z} from 'zod';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;
type FormValues = z.infer<typeof loginSchema>;

export function LoginScreen({navigation}: Props) {
  const theme = useTheme();
  const setSession = useSessionStore(s => s.setSession);
  const [error, setError] = useState<string | null>(null);
  const {control, handleSubmit, formState} = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {phone: '+221771234567', password: 'Demo1234!'},
  });
  const {fieldProps} = useInputFocusChain(['phone', 'password'] as const);

  const onSubmit = handleSubmit(async values => {
    setError(null);
    try {
      const result = unwrap(await authApi.login(values));
      await setSession(result.user, result.tokens);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Connexion impossible');
    }
  });

  const phoneField = fieldProps('phone');
  const passwordField = fieldProps('password', {
    onLastSubmit: () => {
      void onSubmit();
    },
    lastReturnKeyType: 'go',
  });

  return (
    <Screen>
      <View style={styles.brand}>
        <BrandLogo variant="icon" size={64} showTagline />
      </View>
      <Text
        accessibilityRole="header"
        style={{
          color: theme.colors.textPrimary,
          fontSize: theme.typography.h3,
          fontWeight: '700',
          marginBottom: theme.spacing.sm,
        }}>
        Bon retour
      </Text>
      <Text
        style={{
          color: theme.colors.textSecondary,
          fontSize: theme.typography.body,
          marginBottom: theme.spacing['2xl'],
          lineHeight: 22,
        }}>
        Connectez-vous à votre compte pour continuer.
      </Text>
      <Controller
        control={control}
        name="phone"
        render={({field: {onChange, value}}) => (
          <TextField
            ref={phoneField.ref}
            label="Téléphone"
            keyboardType="phone-pad"
            value={value}
            onChangeText={onChange}
            error={formState.errors.phone?.message}
            returnKeyType={phoneField.returnKeyType}
            submitBehavior={phoneField.submitBehavior}
            accessoryActionLabel={phoneField.accessoryActionLabel}
            onSubmitEditing={phoneField.onSubmitEditing}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({field: {onChange, value}}) => (
          <TextField
            ref={passwordField.ref}
            label="Mot de passe"
            secureTextEntry
            value={value}
            onChangeText={onChange}
            error={formState.errors.password?.message}
            returnKeyType={passwordField.returnKeyType}
            submitBehavior={passwordField.submitBehavior}
            onSubmitEditing={passwordField.onSubmitEditing}
          />
        )}
      />
      {error ? (
        <Text style={{color: theme.colors.error, marginBottom: 12}}>
          {error}
        </Text>
      ) : null}
      <Button
        label="Se connecter"
        loading={formState.isSubmitting}
        onPress={onSubmit}
      />
      <Button
        label="Mot de passe oublié"
        variant="ghost"
        onPress={() => navigation.navigate('ForgotPassword')}
        style={{marginTop: 12}}
      />
      <Text
        style={{
          marginTop: theme.spacing['2xl'],
          textAlign: 'center',
          color: theme.colors.textMuted,
          fontSize: theme.typography.caption,
        }}>
        Vos données sont sécurisées et protégées
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  brand: {alignItems: 'center', marginBottom: 24},
});
