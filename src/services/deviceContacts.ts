import Contacts from 'react-native-contacts';

export type DeviceContact = {
  id: string;
  displayName: string;
  phoneNumber: string;
};

const CACHE_TTL_MS = 5 * 60 * 1000;

type ContactsCache = {
  items: DeviceContact[];
  loadedAt: number;
};

let memoryCache: ContactsCache | null = null;
let inflight: Promise<DeviceContact[]> | null = null;

function pickPrimaryPhone(
  phones: Array<{number?: string | null}> | undefined,
): string | null {
  if (!phones?.length) {
    return null;
  }
  for (const entry of phones) {
    const raw = entry.number?.trim();
    if (raw && raw.replace(/\D/g, '').length >= 6) {
      return raw;
    }
  }
  return null;
}

function displayNameFromContact(contact: {
  givenName?: string | null;
  familyName?: string | null;
  displayName?: string | null;
  middleName?: string | null;
}): string {
  if (contact.displayName?.trim()) {
    return contact.displayName.trim();
  }
  return [contact.givenName, contact.middleName, contact.familyName]
    .filter(Boolean)
    .join(' ')
    .trim();
}

function mapContacts(
  raw: Awaited<ReturnType<typeof Contacts.getAllWithoutPhotos>>,
): DeviceContact[] {
  const mapped: DeviceContact[] = [];

  for (const contact of raw) {
    const phoneNumber = pickPrimaryPhone(contact.phoneNumbers);
    if (!phoneNumber) {
      continue;
    }
    const displayName = displayNameFromContact(contact) || phoneNumber;
    mapped.push({
      id: contact.recordID,
      displayName,
      phoneNumber,
    });
  }

  mapped.sort((a, b) =>
    a.displayName.localeCompare(b.displayName, 'fr', {sensitivity: 'base'}),
  );
  return mapped;
}

async function fetchDeviceContacts(): Promise<DeviceContact[]> {
  const raw = await Contacts.getAllWithoutPhotos();
  return mapContacts(raw);
}

/** Invalide le cache mémoire (ex. après retour des réglages permissions). */
export function invalidateDeviceContactsCache(): void {
  memoryCache = null;
  inflight = null;
}

/**
 * Charge les contacts device ayant au moins un numéro.
 * Cache mémoire TTL + déduplique les lectures concurrentes.
 */
export async function loadDeviceContacts(
  options?: {force?: boolean},
): Promise<DeviceContact[]> {
  const force = options?.force === true;
  const now = Date.now();

  if (
    !force &&
    memoryCache &&
    now - memoryCache.loadedAt < CACHE_TTL_MS
  ) {
    return memoryCache.items;
  }

  if (!force && inflight) {
    return inflight;
  }

  inflight = fetchDeviceContacts()
    .then(items => {
      memoryCache = {items, loadedAt: Date.now()};
      return items;
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}
