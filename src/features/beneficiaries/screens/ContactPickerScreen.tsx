import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Search} from 'lucide-react-native';
import type {AppStackParamList} from '../../../navigation/types';
import {Screen} from '../../../components/ui/Screen';
import {Avatar} from '../../../components/ui/ListRow';
import {Button} from '../../../components/ui/Button';
import {useTheme} from '../../../theme/ThemeProvider';
import {useAppPermissions} from '../../../hooks/useAppPermissions';
import type {DeviceContact} from '../../../services/deviceContacts';
import {useTransferDraftStore} from '../../../stores/transferDraftStore';
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '../../../components/feedback/StateViews';
import {
  parsePhoneAgainstCatalog,
  splitContactDisplayName,
} from '../../../utils/phone';
import {
  useCountriesQuery,
  useDeviceContactsQuery,
  useInvalidateDeviceContacts,
} from '../../../hooks/queries';

type Props = NativeStackScreenProps<AppStackParamList, 'ContactPicker'>;

const ROW_HEIGHT = 48;

export function ContactPickerScreen({navigation}: Props) {
  const theme = useTheme();
  const {ensure, openSettings} = useAppPermissions();
  const setDraft = useTransferDraftStore(s => s.setDraft);
  const {data: countries} = useCountriesQuery();
  const [query, setQuery] = useState('');
  const [permissionChecked, setPermissionChecked] = useState(false);
  const [denied, setDenied] = useState(false);
  const invalidateContacts = useInvalidateDeviceContacts();

  const contactsEnabled = permissionChecked && !denied;
  const {
    data: contacts = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useDeviceContactsQuery(contactsEnabled);

  const ensureAccess = useCallback(async () => {
    const allowed = await ensure('contacts');
    setPermissionChecked(true);
    if (!allowed) {
      setDenied(true);
      return false;
    }
    setDenied(false);
    return true;
  }, [ensure]);

  useEffect(() => {
    void ensureAccess();
  }, [ensureAccess]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return contacts;
    }
    const qDigits = q.replace(/\s/g, '');
    return contacts.filter(
      c =>
        c.displayName.toLowerCase().includes(q) ||
        c.phoneNumber.replace(/\s/g, '').includes(qDigits),
    );
  }, [contacts, query]);

  const onSelect = useCallback(
    (contact: DeviceContact) => {
      const {firstName, lastName} = splitContactDisplayName(contact.displayName);
      const parsed =
        countries && countries.length > 0
          ? parsePhoneAgainstCatalog(contact.phoneNumber, countries)
          : null;

      if (parsed) {
        setDraft({
          destinationFirstName: firstName,
          destinationLastName: lastName,
          destinationPhone: `${parsed.dialCode}${parsed.nationalNumber}`,
          destinationCountryCode: parsed.countryCode,
          beneficiaryId: undefined,
          pendingContactApply: true,
        });
      } else {
        setDraft({
          destinationFirstName: firstName,
          destinationLastName: lastName,
          destinationPhone: contact.phoneNumber.replace(/\s/g, ''),
          beneficiaryId: undefined,
          pendingContactApply: true,
        });
      }

      navigation.goBack();
    },
    [countries, navigation, setDraft],
  );

  const onRefresh = useCallback(() => {
    invalidateContacts();
    void refetch();
  }, [invalidateContacts, refetch]);

  const renderItem = useCallback(
    ({item, index}: {item: DeviceContact; index: number}) => {
      const last = index === filtered.length - 1;
      return (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${item.displayName}, ${item.phoneNumber}`}
          onPress={() => onSelect(item)}
          style={({pressed}) => ({
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            paddingHorizontal: 12,
            paddingVertical: 8,
            minHeight: ROW_HEIGHT,
            opacity: pressed ? 0.72 : 1,
            borderBottomWidth: last ? 0 : StyleSheet.hairlineWidth,
            borderBottomColor: theme.colors.divider,
          })}>
          <Avatar name={item.displayName} size={32} />
          <View style={{flex: 1}}>
            <Text
              numberOfLines={1}
              style={{
                color: theme.colors.textPrimary,
                fontWeight: '600',
                fontSize: theme.typography.bodySmall,
              }}>
              {item.displayName}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                color: theme.colors.textSecondary,
                marginTop: 1,
                fontSize: theme.typography.caption,
              }}>
              {item.phoneNumber}
            </Text>
          </View>
        </Pressable>
      );
    },
    [filtered.length, onSelect, theme],
  );

  if (!permissionChecked || (contactsEnabled && isLoading && contacts.length === 0)) {
    return <LoadingState label="Chargement des contacts…" />;
  }

  if (denied) {
    return (
      <Screen title="Choix du contact" scroll={false}>
        <EmptyState
          title="Accès contacts requis"
          description="Autorisez le carnet d’adresses pour sélectionner un bénéficiaire rapidement."
          actionLabel="Ouvrir les réglages"
          onAction={() => {
            void openSettings();
          }}
        />
        <Button
          label="Réessayer"
          variant="secondary"
          onPress={() => {
            void ensureAccess();
          }}
          style={{marginTop: 12}}
        />
      </Screen>
    );
  }

  if (isError && contacts.length === 0) {
    return (
      <ErrorState
        message="Impossible de charger vos contacts."
        onRetry={onRefresh}
      />
    );
  }

  return (
    <Screen
      title="Choix du contact"
      subtitle="Tous mes contacts"
      scroll={false}
      style={{flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radius.lg,
          borderWidth: 1,
          borderColor: theme.colors.border,
          paddingHorizontal: 14,
          minHeight: 44,
          marginBottom: 10,
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
            paddingVertical: 8,
          }}
        />
      </View>

      {filtered.length === 0 ? (
        <EmptyState
          title="Aucun contact"
          description={
            query
              ? 'Aucun résultat pour cette recherche.'
              : 'Aucun contact avec numéro trouvé sur cet appareil.'
          }
        />
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radius.lg,
            borderWidth: 1,
            borderColor: theme.colors.border,
            overflow: 'hidden',
          }}>
          <FlatList
            data={filtered}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            keyboardShouldPersistTaps="handled"
            initialNumToRender={24}
            maxToRenderPerBatch={32}
            windowSize={10}
            removeClippedSubviews
            refreshing={isFetching && !isLoading}
            onRefresh={onRefresh}
            getItemLayout={(_data, index) => ({
              length: ROW_HEIGHT,
              offset: ROW_HEIGHT * index,
              index,
            })}
          />
        </View>
      )}
    </Screen>
  );
}
