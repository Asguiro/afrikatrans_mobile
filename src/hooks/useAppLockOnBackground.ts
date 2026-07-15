import {useEffect, useRef} from 'react';
import {AppState, type AppStateStatus} from 'react-native';
import {useAppLockGateStore} from '../stores/appLockGateStore';
import {useSessionStore} from '../stores/sessionStore';
import {shouldScheduleBackgroundLock} from '../utils/appLockLifecycle';

/**
 * Délai avant verrouillage après passage en arrière-plan.
 * Couvre les bascules brèves (permissions, share sheet, multitâche).
 */
const BACKGROUND_LOCK_GRACE_MS = 1500;

/**
 * Verrouille l’app après une absence réelle en arrière-plan.
 *
 * Règles (AppState RN) :
 * - on verrouille à l’entrée en `background` (y compris via `inactive`
 *   sur iOS : active → inactive → background) ;
 * - jamais sur `inactive` seul (Centre de contrôle, Face ID, transitions) ;
 * - grace period + cooldown post-unlock pour éviter le re-lock
 *   quand Android émet un `background` à la fermeture du prompt biométrique ;
 * - `appLockGateStore` pour les intents système (galerie, share, etc.).
 */
export function useAppLockOnBackground(): void {
  const lockApp = useSessionStore(s => s.lockApp);
  const isAuthenticated = useSessionStore(s => s.isAuthenticated);
  const hasLocalAuth = useSessionStore(s => s.hasLocalAuth);
  const appState = useRef(AppState.currentState);
  const lockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const clearLockTimer = () => {
      if (lockTimer.current != null) {
        clearTimeout(lockTimer.current);
        lockTimer.current = null;
      }
    };

    const scheduleLock = () => {
      clearLockTimer();
      if (!isAuthenticated || !hasLocalAuth) {
        return;
      }
      if (useAppLockGateStore.getState().shouldSkipBackgroundLock()) {
        return;
      }
      lockTimer.current = setTimeout(() => {
        lockTimer.current = null;
        if (useAppLockGateStore.getState().shouldSkipBackgroundLock()) {
          return;
        }
        if (AppState.currentState !== 'active') {
          lockApp();
        }
      }, BACKGROUND_LOCK_GRACE_MS);
    };

    const onChange = (next: AppStateStatus) => {
      const previous = appState.current;
      appState.current = next;

      if (shouldScheduleBackgroundLock(previous, next)) {
        scheduleLock();
        return;
      }

      if (next === 'active') {
        clearLockTimer();
      }
    };

    const sub = AppState.addEventListener('change', onChange);
    return () => {
      clearLockTimer();
      sub.remove();
    };
  }, [hasLocalAuth, isAuthenticated, lockApp]);
}
