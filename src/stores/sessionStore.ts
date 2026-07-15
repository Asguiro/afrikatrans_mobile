import {create} from 'zustand';
import type {UserProfile, AuthTokens} from '../types/api';
import {env} from '../config/env';
import {
  clearPin,
  clearTokens,
  disableBiometricUnlock,
  ensureDemoPin,
  hasStoredPin,
  isBiometricUnlockEnabled,
  loadTokens,
  saveTokens,
} from '../services/secureStorage';
import {usePreferencesStore} from './preferencesStore';
import {useAppLockGateStore} from './appLockGateStore';

type SessionState = {
  isHydrated: boolean;
  isAuthenticated: boolean;
  /** Session authentifiée mais app verrouillée (PIN / biométrie requis). */
  isAppLocked: boolean;
  /** PIN et/ou biométrie Keychain disponibles pour protéger l’app. */
  hasLocalAuth: boolean;
  user: UserProfile | null;
  tokens: AuthTokens | null;
  hydrate: () => Promise<void>;
  setSession: (user: UserProfile, tokens: AuthTokens) => Promise<void>;
  setUser: (user: UserProfile) => void;
  refreshLocalAuth: () => Promise<boolean>;
  lockApp: () => void;
  unlockApp: () => void;
  signOut: () => Promise<void>;
};

async function resolveLocalAuth(): Promise<boolean> {
  // Séquentiel : DataStore Android Keychain refuse les accès parallèles.
  const pinConfigured = await hasStoredPin();
  const biometricEnabled = await isBiometricUnlockEnabled();
  usePreferencesStore.getState().setBiometricEnabled(biometricEnabled);
  return pinConfigured || biometricEnabled;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  isHydrated: false,
  isAuthenticated: false,
  isAppLocked: false,
  hasLocalAuth: false,
  user: null,
  tokens: null,

  hydrate: async () => {
    try {
      const tokens = await loadTokens();
      if (tokens && env.USE_MOCKS) {
        // Répare les sessions déjà ouvertes sans PIN Keychain.
        await ensureDemoPin(env.DEMO_PIN);
      }
      const hasLocalAuth = await resolveLocalAuth();
      const authenticated = Boolean(tokens);
      set({
        isHydrated: true,
        isAuthenticated: authenticated,
        hasLocalAuth,
        // Cold start : exiger l’auth locale si elle est configurée.
        isAppLocked: authenticated && hasLocalAuth,
        tokens,
      });
    } catch {
      // Éviter un splash bloqué si Keychain échoue ponctuellement.
      set({
        isHydrated: true,
        isAuthenticated: false,
        hasLocalAuth: false,
        isAppLocked: false,
        tokens: null,
      });
    }
  },

  setSession: async (user, tokens) => {
    await saveTokens(tokens);
    if (env.USE_MOCKS && user.hasPin) {
      await ensureDemoPin(env.DEMO_PIN);
    }
    const hasLocalAuth = await resolveLocalAuth();
    set({
      user,
      tokens,
      isAuthenticated: true,
      isHydrated: true,
      hasLocalAuth,
      isAppLocked: false,
    });
    useAppLockGateStore.getState().markUnlocked();
  },

  setUser: user => set({user}),

  refreshLocalAuth: async () => {
    const hasLocalAuth = await resolveLocalAuth();
    set({hasLocalAuth});
    if (!hasLocalAuth && get().isAppLocked) {
      set({isAppLocked: false});
    }
    return hasLocalAuth;
  },

  lockApp: () => {
    const {isAuthenticated, hasLocalAuth, isAppLocked} = get();
    if (!isAuthenticated || !hasLocalAuth || isAppLocked) {
      return;
    }
    if (useAppLockGateStore.getState().shouldSkipBackgroundLock()) {
      return;
    }
    set({isAppLocked: true});
  },

  unlockApp: () => {
    useAppLockGateStore.getState().markUnlocked();
    set({isAppLocked: false});
  },

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
      hasLocalAuth: false,
    });
  },
}));
