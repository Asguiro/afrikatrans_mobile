import type {Country} from '../types/api';

/** Compose un numéro E.164 à partir de l’indicatif et du national. */
export function composePhone(dialCode: string, nationalNumber: string): string {
  const dial = dialCode.trim();
  const digits = nationalNumber.replace(/\D/g, '');
  return `${dial}${digits}`;
}

/** Retire l’indicatif d’un numéro stocké en E.164 pour l’édition. */
export function stripDialCode(phone: string, dialCode: string): string {
  const digits = phone.replace(/\D/g, '');
  const dialDigits = dialCode.replace(/\D/g, '');
  if (dialDigits && digits.startsWith(dialDigits)) {
    return digits.slice(dialDigits.length);
  }
  return digits;
}

export type ParsedCatalogPhone = {
  countryCode: string;
  dialCode: string;
  nationalNumber: string;
};

/**
 * Détecte le pays / indicatif à partir d’un numéro brut via le catalogue
 * (match de l’indicatif le plus long).
 */
export function parsePhoneAgainstCatalog(
  raw: string,
  countries: Country[],
): ParsedCatalogPhone | null {
  const digits = raw.replace(/\D/g, '');
  if (!digits) {
    return null;
  }

  const sorted = [...countries].sort(
    (a, b) =>
      b.dialCode.replace(/\D/g, '').length -
      a.dialCode.replace(/\D/g, '').length,
  );

  for (const country of sorted) {
    const dialDigits = country.dialCode.replace(/\D/g, '');
    if (dialDigits && digits.startsWith(dialDigits)) {
      const nationalNumber = digits.slice(dialDigits.length);
      if (nationalNumber.length >= 6) {
        return {
          countryCode: country.code,
          dialCode: country.dialCode,
          nationalNumber,
        };
      }
    }
  }

  return null;
}

/** Sépare prénom / nom à partir d’un libellé contact. */
export function splitContactDisplayName(displayName: string): {
  firstName: string;
  lastName: string;
} {
  const parts = displayName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return {firstName: 'Destinataire', lastName: ''};
  }
  if (parts.length === 1) {
    return {firstName: parts[0], lastName: ''};
  }
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' '),
  };
}
