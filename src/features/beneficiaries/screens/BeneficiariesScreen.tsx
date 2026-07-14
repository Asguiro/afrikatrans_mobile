import React from 'react';
import {Alert, Pressable, Text, View} from 'react-native';
import type {CompositeScreenProps} from '@react-navigation/native';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Plus, Star, Trash2} from 'lucide-react-native';
import type {
  AppStackParamList,
  AppTabParamList,
} from '../../../navigation/types';
import {Screen} from '../../../components/ui/Screen';
import {Avatar} from '../../../components/ui/ListRow';
import {useTheme} from '../../../theme/ThemeProvider';
import {
  useBeneficiariesQuery,
  useDeleteBeneficiaryMutation,
} from '../../../hooks/queries';
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '../../../components/feedback/StateViews';

type Props = CompositeScreenProps<
  BottomTabScreenProps<AppTabParamList, 'BeneficiariesTab'>,
  NativeStackScreenProps<AppStackParamList>
>;

export function BeneficiariesScreen({navigation}: Props) {
  const theme = useTheme();
  const {data, isLoading, isError, refetch} = useBeneficiariesQuery();
  const removeMutation = useDeleteBeneficiaryMutation();

  if (isLoading) {
    return <LoadingState />;
  }
  if (isError) {
    return (
      <ErrorState
        message="Impossible de charger les bénéficiaires"
        onRetry={refetch}
      />
    );
  }

  return (
    <Screen
      title="Contacts"
      subtitle="Personnes à qui vous envoyez souvent.">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Ajouter un bénéficiaire"
        onPress={() => navigation.navigate('BeneficiaryForm')}
        style={({pressed}) => ({
          backgroundColor: theme.colors.brandPrimary,
          borderRadius: theme.radius.lg,
          minHeight: 48,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          marginBottom: 18,
          opacity: pressed ? 0.9 : 1,
        })}>
        <Plus color={theme.colors.onBrandPrimary} size={18} strokeWidth={2.5} />
        <Text style={{color: theme.colors.onBrandPrimary, fontWeight: '700'}}>
          Ajouter
        </Text>
      </Pressable>

      {!data?.length ? (
        <EmptyState
          title="Aucun contact"
          description="Ajoutez un bénéficiaire pour envoyer plus vite."
          actionLabel="Ajouter"
          onAction={() => navigation.navigate('BeneficiaryForm')}
        />
      ) : (
        data.map(b => (
          <Pressable
            key={b.id}
            onPress={() =>
              navigation.navigate('BeneficiaryForm', {beneficiaryId: b.id})
            }
            style={({pressed}) => ({
              backgroundColor: theme.colors.surface,
              borderWidth: 1,
              borderColor: theme.colors.border,
              borderRadius: theme.radius.lg,
              padding: theme.spacing.lg,
              marginBottom: theme.spacing.md,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              opacity: pressed ? 0.88 : 1,
            })}>
            <Avatar name={`${b.firstName} ${b.lastName}`} size={44} />
            <View style={{flex: 1}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                }}>
                <Text
                  style={{
                    color: theme.colors.textPrimary,
                    fontWeight: '700',
                    fontSize: theme.typography.body,
                  }}>
                  {b.firstName} {b.lastName}
                </Text>
                {b.favorite ? (
                  <Star
                    color={theme.colors.brandAccent}
                    size={14}
                    fill={theme.colors.brandAccent}
                  />
                ) : null}
              </View>
              <Text
                style={{
                  color: theme.colors.textSecondary,
                  marginTop: 3,
                  fontSize: theme.typography.caption,
                }}>
                {b.phone}
              </Text>
              <Text
                style={{
                  color: theme.colors.textMuted,
                  marginTop: 2,
                  fontSize: theme.typography.caption,
                }}>
                {b.operatorName}
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Supprimer ${b.firstName} ${b.lastName}`}
              hitSlop={8}
              onPress={() =>
                Alert.alert('Supprimer', 'Confirmer la suppression ?', [
                  {text: 'Annuler', style: 'cancel'},
                  {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: () => removeMutation.mutate(b.id),
                  },
                ])
              }
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                backgroundColor: theme.colors.errorSoft,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Trash2 color={theme.colors.error} size={18} strokeWidth={2} />
            </Pressable>
          </Pressable>
        ))
      )}
    </Screen>
  );
}
