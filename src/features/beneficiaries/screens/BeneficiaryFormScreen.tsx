import React, {useMemo} from 'react';
import {Text} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {AppStackParamList} from '../../../navigation/types';
import {Screen} from '../../../components/ui/Screen';
import {TextField} from '../../../components/ui/TextField';
import {Button} from '../../../components/ui/Button';
import {SelectList} from '../../../components/ui/SelectList';
import {beneficiarySchema} from '../../../schemas/forms';
import {
  useBeneficiariesQuery,
  useOperatorsQuery,
  useUpsertBeneficiaryMutation,
} from '../../../hooks/queries';
import {useTheme} from '../../../theme/ThemeProvider';
import {useInputFocusChain} from '../../../hooks/useInputFocusChain';
import {z} from 'zod';

type Props = NativeStackScreenProps<AppStackParamList, 'BeneficiaryForm'>;
type FormValues = z.infer<typeof beneficiarySchema>;

export function BeneficiaryFormScreen({navigation, route}: Props) {
  const theme = useTheme();
  const beneficiaryId = route.params?.beneficiaryId;
  const {data: beneficiaries} = useBeneficiariesQuery();
  const existing = beneficiaries?.find(b => b.id === beneficiaryId);
  const mutation = useUpsertBeneficiaryMutation();

  const defaults = useMemo<FormValues>(
    () => ({
      firstName: existing?.firstName ?? '',
      lastName: existing?.lastName ?? '',
      phone: existing?.phone ?? '',
      countryCode: existing?.countryCode ?? 'CI',
      operatorId: existing?.operatorId ?? 'op-orange-ci',
    }),
    [existing],
  );

  const {control, handleSubmit, setValue, watch, formState} =
    useForm<FormValues>({
      resolver: zodResolver(beneficiarySchema),
      defaultValues: defaults,
      values: defaults,
    });

  const {fieldProps} = useInputFocusChain([
    'firstName',
    'lastName',
    'phone',
  ] as const);

  const countryCode = watch('countryCode');
  const {data: operators} = useOperatorsQuery(countryCode);

  const onSubmit = handleSubmit(async values => {
    await mutation.mutateAsync({
      id: beneficiaryId,
      ...values,
      favorite: existing?.favorite ?? false,
    });
    navigation.goBack();
  });

  const firstNameField = fieldProps('firstName');
  const lastNameField = fieldProps('lastName');
  const phoneField = fieldProps('phone', {
    onLastSubmit: () => {
      void onSubmit();
    },
  });

  return (
    <Screen
      title={beneficiaryId ? 'Modifier' : 'Nouveau bénéficiaire'}
      subtitle="Informations destinataire Mobile Money.">
      <Controller
        control={control}
        name="firstName"
        render={({field: {onChange, value}}) => (
          <TextField
            ref={firstNameField.ref}
            label="Prénom"
            autoCapitalize="words"
            value={value}
            onChangeText={onChange}
            error={formState.errors.firstName?.message}
            returnKeyType={firstNameField.returnKeyType}
            submitBehavior={firstNameField.submitBehavior}
            onSubmitEditing={firstNameField.onSubmitEditing}
          />
        )}
      />
      <Controller
        control={control}
        name="lastName"
        render={({field: {onChange, value}}) => (
          <TextField
            ref={lastNameField.ref}
            label="Nom"
            autoCapitalize="words"
            value={value}
            onChangeText={onChange}
            error={formState.errors.lastName?.message}
            returnKeyType={lastNameField.returnKeyType}
            submitBehavior={lastNameField.submitBehavior}
            onSubmitEditing={lastNameField.onSubmitEditing}
          />
        )}
      />
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
      <Text style={{color: theme.colors.textSecondary, marginBottom: 8}}>
        Pays
      </Text>
      <SelectList
        options={[
          {id: 'CI', title: "Côte d'Ivoire"},
          {id: 'SN', title: 'Sénégal'},
          {id: 'ML', title: 'Mali'},
        ]}
        onSelect={id => {
          setValue('countryCode', id);
          setValue('operatorId', '');
        }}
      />
      <Text style={{color: theme.colors.textSecondary, marginVertical: 8}}>
        Opérateur
      </Text>
      <SelectList
        options={(operators ?? []).map(o => ({
          id: o.id,
          title: o.name,
          subtitle: o.status === 'AVAILABLE' ? 'Disponible' : o.status,
          disabled: o.status !== 'AVAILABLE',
        }))}
        onSelect={id => setValue('operatorId', id)}
      />
      <Button
        label="Enregistrer"
        loading={mutation.isPending}
        onPress={onSubmit}
      />
    </Screen>
  );
}
