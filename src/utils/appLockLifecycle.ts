import type {AppStateStatus} from 'react-native';

/**
 * Décide si un passage AppState doit programmer un verrouillage.
 *
 * - iOS : `active → inactive → background` — on verrouille à l’entrée en
 *   `background` même si `previous` est `inactive`.
 * - Android : souvent `active → background` directement.
 * - Jamais sur `inactive` seul (Control Center, Face ID, transitions).
 */
export function shouldScheduleBackgroundLock(
  previous: AppStateStatus,
  next: AppStateStatus,
): boolean {
  return next === 'background' && previous !== 'background';
}
