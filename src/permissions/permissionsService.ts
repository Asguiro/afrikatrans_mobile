import {Platform} from 'react-native';
import {
  check,
  checkNotifications,
  request,
  requestNotifications,
} from 'react-native-permissions';
import type {AppPermission, PermissionStatus} from './types';
import {ONBOARDING_PERMISSIONS} from './types';
import {
  isGrantedStatus,
  mapRnStatus,
  toNativePermission,
} from './mapNative';
import {promptMissingPermission} from './messages';

async function checkBiometrics(): Promise<PermissionStatus> {
  // Face ID / empreinte : gérés via Keychain ; exposés pour le catalogue UI.
  // Sur iOS, NSFaceIDUsageDescription est déjà déclaré.
  return Platform.OS === 'ios' || Platform.OS === 'android'
    ? 'granted'
    : 'unavailable';
}

export async function checkPermission(
  permission: AppPermission,
): Promise<PermissionStatus> {
  if (permission === 'notifications') {
    const {status} = await checkNotifications();
    return mapRnStatus(status);
  }
  if (permission === 'biometrics') {
    return checkBiometrics();
  }
  const native = toNativePermission(permission);
  return mapRnStatus(await check(native));
}

export async function checkMultiplePermissions(
  permissions: AppPermission[],
): Promise<Record<AppPermission, PermissionStatus>> {
  const entries = await Promise.all(
    permissions.map(async p => [p, await checkPermission(p)] as const),
  );
  return Object.fromEntries(entries) as Record<AppPermission, PermissionStatus>;
}

export async function requestPermission(
  permission: AppPermission,
): Promise<PermissionStatus> {
  if (permission === 'notifications') {
    const {status} = await requestNotifications(['alert', 'sound', 'badge']);
    return mapRnStatus(status);
  }
  if (permission === 'biometrics') {
    return checkBiometrics();
  }
  const native = toNativePermission(permission);
  return mapRnStatus(await request(native));
}

/**
 * Demande le bundle onboarding dans l’ordre métier.
 * Les refus partiels n’interrompent pas la suite.
 */
export async function requestOnboardingBundle(): Promise<
  Partial<Record<AppPermission, PermissionStatus>>
> {
  const result: Partial<Record<AppPermission, PermissionStatus>> = {};
  for (const permission of ONBOARDING_PERMISSIONS) {
    const current = await checkPermission(permission);
    if (isGrantedStatus(current)) {
      result[permission] = current;
      continue;
    }
    if (current === 'blocked' || current === 'unavailable') {
      result[permission] = current;
      continue;
    }
    result[permission] = await requestPermission(permission);
  }
  return result;
}

/**
 * Garantit un droit au point d’usage.
 * - granted → true (silencieux)
 * - undetermined / denied (re-demandable) → request OS
 * - blocked → prompt Réglages
 */
export async function ensurePermission(
  permission: AppPermission,
): Promise<boolean> {
  const current = await checkPermission(permission);
  if (isGrantedStatus(current)) {
    return true;
  }

  if (current === 'unavailable') {
    await promptMissingPermission(permission);
    return false;
  }

  if (current === 'blocked') {
    await promptMissingPermission(permission);
    return false;
  }

  // undetermined ou denied (Android peut encore re-demander)
  const next = await requestPermission(permission);
  if (isGrantedStatus(next)) {
    return true;
  }

  // Refus ou bloqué : un seul message métier, sans boucler
  await promptMissingPermission(permission);
  return false;
}
