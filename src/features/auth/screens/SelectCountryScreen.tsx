import React from 'react';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {AuthStackParamList} from '../../../navigation/types';
import {Screen} from '../../../components/ui/Screen';
import {SelectList} from '../../../components/ui/SelectList';
import {useCountriesQuery} from '../../../hooks/queries';
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '../../../components/feedback/StateViews';

type Props = NativeStackScreenProps<AuthStackParamList, 'SelectCountry'>;

export function SelectCountryScreen({navigation}: Props) {
  const {data, isLoading, isError, refetch} = useCountriesQuery();

  if (isLoading) {
    return <LoadingState />;
  }
  if (isError || !data) {
    return (
      <ErrorState message="Impossible de charger les pays" onRetry={refetch} />
    );
  }

  return (
    <Screen title="Pays de résidence" subtitle="Choisissez votre pays.">
      {data.length === 0 ? (
        <EmptyState title="Aucun pays disponible" />
      ) : (
        <SelectList
          options={data.map(c => ({
            id: c.code,
            title: c.name,
            subtitle: `${c.dialCode} · ${c.currency}`,
          }))}
          onSelect={code =>
            navigation.navigate('Register', {countryCode: code})
          }
        />
      )}
    </Screen>
  );
}
