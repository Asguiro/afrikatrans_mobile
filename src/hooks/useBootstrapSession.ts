/**
 * Session bootstrap after splash: load profile when tokens exist.
 */
import {useEffect} from 'react';
import {authApi} from '../services/api';
import {unwrap} from '../services/api/helpers';
import {useSessionStore} from '../stores/sessionStore';

export function useBootstrapSession() {
  const isAuthenticated = useSessionStore(s => s.isAuthenticated);
  const isHydrated = useSessionStore(s => s.isHydrated);
  const setUser = useSessionStore(s => s.setUser);
  const user = useSessionStore(s => s.user);

  useEffect(() => {
    if (!isHydrated || !isAuthenticated || user) {
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const me = unwrap(await authApi.me());
        if (!cancelled) {
          setUser(me);
        }
      } catch {
        // Keep session; me() may retry later via screens
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isHydrated, setUser, user]);
}
