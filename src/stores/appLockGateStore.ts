import {AppState, type AppStateStatus, type NativeEventSubscription} from 'react-native';
import {create} from 'zustand';

/**
 * Gate de verrouillage :
 * - suppress : intents système (galerie, share, prompt biométrie)
 * - cooldownAfterUnlock : évite le re-lock immédiat quand Android
 *   passe brièvement en `background` à la fermeture du prompt
 */
type AppLockGateState = {
  suppressCount: number;
  unlockCooldownUntil: number;
  beginSuppress: () => void;
  endSuppress: () => void;
  isSuppressed: () => boolean;
  markUnlocked: (cooldownMs?: number) => void;
  isInUnlockCooldown: () => boolean;
  shouldSkipBackgroundLock: () => boolean;
};

const DEFAULT_UNLOCK_COOLDOWN_MS = 2500;

/** Délai après retour `active` avant de relâcher le suppress (transitions iOS/Android). */
const POST_ACTIVE_SETTLE_MS = 400;

/** Sécurité : ne pas bloquer le suppress indéfiniment si l’app ne revient pas. */
const WAIT_ACTIVE_TIMEOUT_MS = 10_000;

export const useAppLockGateStore = create<AppLockGateState>((set, get) => ({
  suppressCount: 0,
  unlockCooldownUntil: 0,
  beginSuppress: () => set(s => ({suppressCount: s.suppressCount + 1})),
  endSuppress: () =>
    set(s => ({suppressCount: Math.max(0, s.suppressCount - 1)})),
  isSuppressed: () => get().suppressCount > 0,
  markUnlocked: (cooldownMs = DEFAULT_UNLOCK_COOLDOWN_MS) =>
    set({unlockCooldownUntil: Date.now() + cooldownMs}),
  isInUnlockCooldown: () => Date.now() < get().unlockCooldownUntil,
  shouldSkipBackgroundLock: () => {
    const s = get();
    return s.suppressCount > 0 || Date.now() < s.unlockCooldownUntil;
  },
}));

export function beginAppLockSuppress(): void {
  useAppLockGateStore.getState().beginSuppress();
}

export function endAppLockSuppress(): void {
  useAppLockGateStore.getState().endSuppress();
}

/**
 * Attend que l’app soit en `active`, puis un court settle.
 * Évite de relâcher le suppress pendant une transition background encore en cours
 * (ex. fermeture galerie / share sheet).
 */
export function waitUntilAppActive(
  timeoutMs = WAIT_ACTIVE_TIMEOUT_MS,
): Promise<void> {
  if (AppState.currentState === 'active') {
    return new Promise(resolve => {
      setTimeout(resolve, POST_ACTIVE_SETTLE_MS);
    });
  }

  return new Promise(resolve => {
    let settled = false;
    let settleTimer: ReturnType<typeof setTimeout> | null = null;
    let timeoutTimer: ReturnType<typeof setTimeout> | null = null;
    let sub: NativeEventSubscription | null = null;

    const finish = () => {
      if (settled) {
        return;
      }
      settled = true;
      if (settleTimer != null) {
        clearTimeout(settleTimer);
      }
      if (timeoutTimer != null) {
        clearTimeout(timeoutTimer);
      }
      sub?.remove();
      resolve();
    };

    const onActive = () => {
      settleTimer = setTimeout(finish, POST_ACTIVE_SETTLE_MS);
    };

    sub = AppState.addEventListener('change', (next: AppStateStatus) => {
      if (next === 'active') {
        onActive();
      }
    });

    // Race : déjà revenu active entre le check et l’abonnement.
    if (AppState.currentState === 'active') {
      onActive();
    }

    timeoutTimer = setTimeout(finish, timeoutMs);
  });
}

export async function withAppLockSuppressed<T>(
  work: () => Promise<T>,
): Promise<T> {
  beginAppLockSuppress();
  try {
    return await work();
  } finally {
    await waitUntilAppActive();
    endAppLockSuppress();
  }
}
