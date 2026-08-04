import {Platform} from 'react-native';
import {
  PERMISSIONS,
  RESULTS,
  type Permission,
  type PermissionStatus as RnPermissionStatus,
} from 'react-native-permissions';
import type {AppPermission, PermissionStatus} from './types';

/** Permission native pour les droits OS standards (hors notifications / biométrie). */
export function toNativePermission(
  permission: Exclude<AppPermission, 'notifications' | 'biometrics'>,
): Permission {
  if (Platform.OS === 'ios') {
    switch (permission) {
      case 'contacts':
        return PERMISSIONS.IOS.CONTACTS;
      case 'camera':
        return PERMISSIONS.IOS.CAMERA;
      case 'photoLibrary':
        return PERMISSIONS.IOS.PHOTO_LIBRARY;
    }
  }

  switch (permission) {
    case 'contacts':
      return PERMISSIONS.ANDROID.READ_CONTACTS;
    case 'camera':
      return PERMISSIONS.ANDROID.CAMERA;
    case 'photoLibrary':
      return Number(Platform.Version) >= 33
        ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
        : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
  }
}

export function mapRnStatus(status: RnPermissionStatus): PermissionStatus {
  switch (status) {
    case RESULTS.UNAVAILABLE:
      return 'unavailable';
    case RESULTS.DENIED:
      return 'denied';
    case RESULTS.LIMITED:
    case RESULTS.GRANTED:
      return 'granted';
    case RESULTS.BLOCKED:
      return 'blocked';
    default:
      return 'undetermined';
  }
}

export function isGrantedStatus(status: PermissionStatus): boolean {
  return status === 'granted';
}
