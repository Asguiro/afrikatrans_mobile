import {Alert, Linking} from 'react-native';
import {openSettings} from 'react-native-permissions';
import type {AppPermission} from './types';
import {PERMISSION_COPY} from './types';

export async function openAppSettings(): Promise<void> {
  try {
    await openSettings();
  } catch {
    await Linking.openSettings();
  }
}

/** Prompt métier unique quand le droit manque (denied / blocked). */
export function promptMissingPermission(
  permission: AppPermission,
  options?: {onCancel?: () => void},
): Promise<boolean> {
  const copy = PERMISSION_COPY[permission];
  return new Promise(resolve => {
    Alert.alert(copy.title, copy.missingMessage, [
      {
        text: 'Pas maintenant',
        style: 'cancel',
        onPress: () => {
          options?.onCancel?.();
          resolve(false);
        },
      },
      {
        text: 'Réglages',
        onPress: () => {
          void openAppSettings().finally(() => resolve(false));
        },
      },
    ]);
  });
}
