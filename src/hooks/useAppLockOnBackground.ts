import {useEffect, useRef} from 'react';
import {AppState, type AppStateStatus} from 'react-native';
import {useSessionStore} from '../stores/sessionStore';

/**
 * Verrouille l’app quand elle passe en arrière-plan (session active).
 * Le cold start est déjà verrouillé via `hydrate()`.
 */
export function useAppLockOnBackground(): void {
  const lockApp = useSessionStore(s => s.lockApp);
  const isAuthenticated = useSessionStore(s => s.isAuthenticated);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const onChange = (next: AppStateStatus) => {
      const wasActive = appState.current === 'active';
      appState.current = next;
      if (wasActive && next === 'background' && isAuthenticated) {
        lockApp();
      }
    };
    const sub = AppState.addEventListener('change', onChange);
    return () => sub.remove();
  }, [isAuthenticated, lockApp]);
}
