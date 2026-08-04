import {useCallback, useState} from 'react';
import type {AppPermission, PermissionStatus} from '../permissions/types';
import {
  checkMultiplePermissions,
  checkPermission,
  ensurePermission,
  requestOnboardingBundle,
  requestPermission,
} from '../permissions/permissionsService';
import {openAppSettings} from '../permissions/messages';

/**
 * Hook unifié pour vérifier / demander / garantir les autorisations OS.
 */
export function useAppPermissions() {
  const [busy, setBusy] = useState(false);

  const check = useCallback(async (permission: AppPermission) => {
    return checkPermission(permission);
  }, []);

  const checkMultiple = useCallback(async (list: AppPermission[]) => {
    return checkMultiplePermissions(list);
  }, []);

  const request = useCallback(async (permission: AppPermission) => {
    setBusy(true);
    try {
      return await requestPermission(permission);
    } finally {
      setBusy(false);
    }
  }, []);

  const requestOnboarding = useCallback(async () => {
    setBusy(true);
    try {
      return await requestOnboardingBundle();
    } finally {
      setBusy(false);
    }
  }, []);

  const ensure = useCallback(async (permission: AppPermission) => {
    setBusy(true);
    try {
      return await ensurePermission(permission);
    } finally {
      setBusy(false);
    }
  }, []);

  const openSettings = useCallback(async () => {
    await openAppSettings();
  }, []);

  return {
    busy,
    check,
    checkMultiple,
    request,
    requestOnboarding,
    ensure,
    openSettings,
  };
}

export type {AppPermission, PermissionStatus};
