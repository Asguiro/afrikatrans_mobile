import * as Keychain from 'react-native-keychain';
import type {AuthTokens} from '../types/api';

const SERVICE = 'afrikatrans.auth';
const PIN_SERVICE = 'afrikatrans.pin';
const UNLOCK_SERVICE = 'afrikatrans.unlock';

const unlockPrompt = {
  title: 'AfrikaTrans',
  subtitle: 'Déverrouillez l’application',
  cancel: 'Annuler',
} as const;

export async function saveTokens(tokens: AuthTokens): Promise<void> {
  await Keychain.setGenericPassword('tokens', JSON.stringify(tokens), {
    service: SERVICE,
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
}

export async function loadTokens(): Promise<AuthTokens | null> {
  const result = await Keychain.getGenericPassword({service: SERVICE});
  if (!result) {
    return null;
  }
  try {
    return JSON.parse(result.password) as AuthTokens;
  } catch {
    return null;
  }
}

export async function clearTokens(): Promise<void> {
  await Keychain.resetGenericPassword({service: SERVICE});
}

export async function savePin(pin: string): Promise<void> {
  await Keychain.setGenericPassword('pin', pin, {
    service: PIN_SERVICE,
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
}

export async function verifyStoredPin(pin: string): Promise<boolean> {
  const result = await Keychain.getGenericPassword({service: PIN_SERVICE});
  if (!result) {
    return false;
  }
  return result.password === pin;
}

export async function clearPin(): Promise<void> {
  await Keychain.resetGenericPassword({service: PIN_SERVICE});
}

export async function hasStoredPin(): Promise<boolean> {
  return Keychain.hasGenericPassword({service: PIN_SERVICE});
}

export async function getSupportedBiometryType(): Promise<string | null> {
  return Keychain.getSupportedBiometryType();
}

export async function isBiometricUnlockEnabled(): Promise<boolean> {
  return Keychain.hasGenericPassword({service: UNLOCK_SERVICE});
}

/** Enregistre un secret Keychain protégé par biométrie (prompt au set). */
export async function enableBiometricUnlock(): Promise<boolean> {
  const biometry = await getSupportedBiometryType();
  if (!biometry) {
    return false;
  }
  try {
    await Keychain.setGenericPassword('unlock', '1', {
      service: UNLOCK_SERVICE,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
      authenticationPrompt: {
        title: 'Activer la biométrie',
        subtitle: 'Confirmez pour sécuriser le déverrouillage',
        cancel: 'Annuler',
      },
    });
    return true;
  } catch {
    return false;
  }
}

export async function disableBiometricUnlock(): Promise<void> {
  await Keychain.resetGenericPassword({service: UNLOCK_SERVICE});
}

/** Demande Face ID / empreinte via lecture Keychain à contrôle d’accès. */
export async function authenticateWithBiometrics(): Promise<boolean> {
  try {
    const result = await Keychain.getGenericPassword({
      service: UNLOCK_SERVICE,
      authenticationPrompt: unlockPrompt,
    });
    return Boolean(result);
  } catch {
    return false;
  }
}
