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
