import {create} from 'zustand';
import type {UserProfile} from '../types/api';
import {
  clearPin,
  clearTokens,
  disableBiometricUnlock,
  hasStoredPin,
  isBiometricUnlockEnabled,
  loadTokens,
  saveTokens,
} from '../services/secureStorage';
import type {AuthTokens} from '../types/api';
import {usePreferencesStore} from './preferencesStore';

type SessionState = {
  isHydrated: boolean;
  isAuthenticated: boolean;
  /** Session authentifiée mais app verrouillée (PIN / biométrie requis). */
  isAppLocked: boolean;
  user: UserProfile | null;
  tokens: AuthTokens | null;
  hydrate: () => Promise<void>;
  setSession: (user: UserProfile, tokens: AuthTokens) => Promise<void>;
  setUser: (user: UserProfile) => void;
  lockApp: () => void;
  unlockApp: () => void;
  signOut: () => Promise<void>;
};

export const useSessionStore = create<SessionState>(set => ({
  isHydrated: false,
  isAuthenticated: false,
  isAppLocked: false,
  user: null,
  tokens: null,
  hydrate: async () => {
    const tokens = await loadTokens();
    const biometricEnabled = await isBiometricUnlockEnabled();
    const pinConfigured = await hasStoredPin();
    usePreferencesStore.getState().setBiometricEnabled(biometricEnabled);
    const authenticated = Boolean(tokens);
    set({
      isHydrated: true,
      isAuthenticated: authenticated,
      // Verrouille seulement si un mécanisme local est disponible.
      isAppLocked: authenticated && (pinConfigured || biometricEnabled),
      tokens,
    });
  },
  setSession: async (user, tokens) => {
    await saveTokens(tokens);
    set({
      user,
      tokens,
      isAuthenticated: true,
      isHydrated: true,
      isAppLocked: false,
    });
  },
  setUser: user => set({user}),
  lockApp: () => {
    const {isAuthenticated} = useSessionStore.getState();
    if (isAuthenticated) {
      set({isAppLocked: true});
    }
  },
  unlockApp: () => set({isAppLocked: false}),
  signOut: async () => {
    await clearTokens();
    await clearPin();
    await disableBiometricUnlock();
    usePreferencesStore.getState().setBiometricEnabled(false);
    set({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isAppLocked: false,
    });
  },
}));
