import React, {useMemo, useState} from 'react';
import {Alert, Pressable, Text, TextInput, View} from 'react-native';
import type {CompositeScreenProps} from '@react-navigation/native';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Plus, Search, Star, Trash2} from 'lucide-react-native';
import type {
  AppStackParamList,
  AppTabParamList,
} from '../../../navigation/types';
import type {Beneficiary} from '../../../types/api';
import {Screen} from '../../../components/ui/Screen';
import {Avatar} from '../../../components/ui/ListRow';
import {useTheme} from '../../../theme/ThemeProvider';
import {
  useBeneficiariesQuery,
  useDeleteBeneficiaryMutation,
  useTransactionsQuery,
  useUpsertBeneficiaryMutation,
} from '../../../hooks/queries';
import {useTransferDraftStore} from '../../../stores/transferDraftStore';
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '../../../components/feedback/StateViews';
import {OPERATOR_BRANDS} from '../../transfer/constants/operatorBrands';

type Props = CompositeScreenProps<
  BottomTabScreenProps<AppTabParamList, 'BeneficiariesTab'>,
  NativeStackScreenProps<AppStackParamList>
>;

function brandCodeFromOperatorName(operatorName: string): string | undefined {
  const match = OPERATOR_BRANDS.find(
    b =>
      operatorName.toLowerCase().includes(b.name.toLowerCase()) ||
      operatorName.toLowerCase().includes(b.code.toLowerCase()),
  );
  return match?.code;
}

export function BeneficiariesScreen({navigation}: Props) {
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const {data, isLoading, isError, refetch} = useBeneficiariesQuery();
  const {data: transactions} = useTransactionsQuery();
  const removeMutation = useDeleteBeneficiaryMutation();
  const upsertMutation = useUpsertBeneficiaryMutation();
  const setDraft = useTransferDraftStore(s => s.setDraft);

  const filtered = useMemo(() => {
    if (!data) {
      return [];
    }
    const q = query.trim().toLowerCase();
    if (!q) {
      return data;
    }
    return data.filter(
      b =>
        `${b.firstName} ${b.lastName}`.toLowerCase().includes(q) ||
        b.phone.toLowerCase().includes(q),
    );
  }, [data, query]);

  const favorites = useMemo(
    () => filtered.filter(b => b.favorite),
    [filtered],
  );

  const recents = useMemo(() => {
    if (!transactions?.length || !filtered.length) {
      return [];
    }
    const byId = new Map(filtered.map(b => [b.id, b]));
    const byPhone = new Map(filtered.map(b => [b.phone, b]));
    const seen = new Set<string>();
    const list: Beneficiary[] = [];
    for (const txn of [...transactions].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )) {
      const match =
        byId.get(txn.beneficiaryId) ?? byPhone.get(txn.destinationPhone);
      if (match && !seen.has(match.id)) {
        seen.add(match.id);
        list.push(match);
      }
      if (list.length >= 5) {
        break;
      }
    }
    return list;
  }, [filtered, transactions]);

  const startTransfer = (b: Beneficiary) => {
    setDraft({
      destinationCountryCode: b.countryCode,
      destinationOperatorId: b.operatorId,
      destinationOperatorCode: brandCodeFromOperatorName(b.operatorName),
      destinationPhone: b.phone,
      destinationFirstName: b.firstName,
      destinationLastName: b.lastName,
      beneficiaryId: b.id,
      quoteId: undefined,
      pendingContactApply: true,
    });
    navigation.navigate('Tabs', {screen: 'HomeTab'});
  };

  const toggleFavorite = (b: Beneficiary) => {
    upsertMutation.mutate({
      id: b.id,
      firstName: b.firstName,
      lastName: b.lastName,
      phone: b.phone,
      countryCode: b.countryCode,
      operatorId: b.operatorId,
      favorite: !b.favorite,
    });
  };

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

  const renderRow = (b: Beneficiary) => (
    <Pressable
      key={b.id}
      onPress={() => startTransfer(b)}
      onLongPress={() =>
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
        <Text
          style={{
            color: theme.colors.textPrimary,
            fontWeight: '700',
            fontSize: theme.typography.body,
          }}>
          {b.firstName} {b.lastName}
        </Text>
        <Text
          style={{
            color: theme.colors.textSecondary,
            marginTop: 3,
            fontSize: theme.typography.caption,
          }}>
          {b.phone}
        </Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          b.favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'
        }
        hitSlop={8}
        onPress={() => toggleFavorite(b)}
        style={{
          width: 44,
          height: 44,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Star
          color={theme.colors.brandAccent}
          size={18}
          strokeWidth={2}
          fill={b.favorite ? theme.colors.brandAccent : 'transparent'}
        />
      </Pressable>
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
  );

  const renderSection = (title: string, items: Beneficiary[]) => {
    if (items.length === 0) {
      return null;
    }
    return (
      <View style={{marginBottom: theme.spacing.lg}}>
        <Text
          style={{
            color: theme.colors.brandPrimary,
            fontWeight: '800',
            fontSize: theme.typography.body,
            marginBottom: theme.spacing.md,
          }}>
          {title}
        </Text>
        {items.map(renderRow)}
      </View>
    );
  };

  return (
    <Screen
      title="Favoris"
      subtitle="Contacts favoris et récents pour envoyer plus vite.">
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
          marginBottom: 16,
          opacity: pressed ? 0.9 : 1,
        })}>
        <Plus color={theme.colors.onBrandPrimary} size={18} strokeWidth={2.5} />
        <Text style={{color: theme.colors.onBrandPrimary, fontWeight: '700'}}>
          Ajouter
        </Text>
      </Pressable>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radius.lg,
          borderWidth: 1,
          borderColor: theme.colors.border,
          paddingHorizontal: 14,
          minHeight: 48,
          marginBottom: 18,
          gap: 10,
        }}>
        <Search color={theme.colors.textMuted} size={18} strokeWidth={2} />
        <TextInput
          accessibilityLabel="Rechercher un contact"
          placeholder="Saisir un nom ou un numéro"
          placeholderTextColor={theme.colors.textMuted}
          value={query}
          onChangeText={setQuery}
          style={{
            flex: 1,
            color: theme.colors.textPrimary,
            fontSize: theme.typography.body,
            paddingVertical: 10,
          }}
        />
      </View>

      {!data?.length ? (
        <EmptyState
          title="Aucun contact"
          description="Ajoutez un bénéficiaire pour envoyer plus vite."
          actionLabel="Ajouter"
          onAction={() => navigation.navigate('BeneficiaryForm')}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Aucun résultat"
          description="Aucun contact ne correspond à votre recherche."
        />
      ) : (
        <>
          {renderSection('Favoris', favorites)}
          {renderSection('Récents', recents)}
          {renderSection('Tous', filtered)}
        </>
      )}
    </Screen>
  );
}
