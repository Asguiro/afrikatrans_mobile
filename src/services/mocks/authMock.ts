import type {AuthApi} from '../api/contracts';
import {createId, delay, fail, ok} from '../api/helpers';
import {
  DEMO_PIN,
  mockPassword,
  mockUser,
  setMockPassword,
  setMockUser,
} from './fixtures';
import {
  ensureDemoPin,
  hasStoredPin,
  savePin,
  verifyStoredPin,
} from '../secureStorage';

const DEMO_OTP = '123456';

const WEAK_PINS = new Set(['0000', '1111', '1234', '4321', '1212', '2222']);

function isWeakPin(pin: string): boolean {
  // Le PIN démo est autorisé pour les parcours mock.
  if (pin === DEMO_PIN) {
    return false;
  }
  if (WEAK_PINS.has(pin)) {
    return true;
  }
  if (pin.length >= 4 && new Set(pin.split('')).size === 1) {
    return true;
  }
  return false;
}

export const mockAuthApi: AuthApi = {
  async register(input) {
    await delay();
    setMockUser({
      ...mockUser,
      id: createId('usr'),
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone,
      countryCode: input.countryCode,
      email: null,
      avatarUrl: null,
      kycStatus: 'NONE',
      hasPin: false,
    });
    setMockPassword(input.password);
    return ok({userId: mockUser.id});
  },

  async verifyOtp(input) {
    await delay();
    if (input.code !== DEMO_OTP) {
      return fail('OTP_INVALID', 'Code OTP incorrect');
    }
    return ok({verified: true});
  },

  async login(input) {
    await delay();
    if (input.password !== mockPassword) {
      return fail('AUTH_INVALID', 'Identifiants incorrects');
    }
    // Compte démo : (ré)écrit le PIN démo pour que le lock fonctionne
    // même après une install où le Keychain était vide ou incohérent.
    await savePin(DEMO_PIN);
    setMockUser({...mockUser, hasPin: true});
    const tokens = {
      accessToken: createId('access'),
      refreshToken: createId('refresh'),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    };
    return ok({
      user: {...mockUser, phone: input.phone, hasPin: true},
      tokens,
    });
  },

  async refresh(refreshToken) {
    await delay();
    if (!refreshToken) {
      return fail('REFRESH_INVALID', 'Session expirée');
    }
    return ok({
      tokens: {
        accessToken: createId('access'),
        refreshToken: createId('refresh'),
        expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      },
    });
  },

  async me() {
    await delay();
    return ok(mockUser);
  },

  async updateMe(input) {
    await delay();
    const email =
      input.email === undefined
        ? mockUser.email
        : input.email?.trim()
          ? input.email.trim()
          : null;
    setMockUser({
      ...mockUser,
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      email,
      avatarUrl: mockUser.avatarUrl,
    });
    return ok({...mockUser});
  },

  async changePassword(input) {
    await delay();
    if (input.currentPassword !== mockPassword) {
      return fail('PASSWORD_INVALID', 'Mot de passe actuel incorrect');
    }
    if (input.newPassword.length < 6) {
      return fail('PASSWORD_WEAK', 'Mot de passe trop court');
    }
    if (input.newPassword === input.currentPassword) {
      return fail(
        'PASSWORD_SAME',
        'Le nouveau mot de passe doit être différent',
      );
    }
    setMockPassword(input.newPassword);
    return ok({updated: true});
  },

  async setPin(pin) {
    await delay();
    if (!/^\d{4,6}$/.test(pin)) {
      return fail('PIN_INVALID', 'Le PIN doit contenir 4 à 6 chiffres');
    }
    if (isWeakPin(pin)) {
      return fail('PIN_WEAK', 'Choisissez un PIN plus difficile à deviner');
    }
    await savePin(pin);
    setMockUser({...mockUser, hasPin: true});
    return ok({hasPin: true});
  },

  async verifyPin(pin) {
    await delay();
    if (!(await hasStoredPin())) {
      await ensureDemoPin(DEMO_PIN);
    }
    const valid = await verifyStoredPin(pin);
    if (!valid) {
      return fail('PIN_INVALID', 'PIN incorrect');
    }
    return ok({valid: true});
  },

  async changePin(input) {
    await delay();
    if (!/^\d{4,6}$/.test(input.newPin)) {
      return fail('PIN_INVALID', 'Le PIN doit contenir 4 à 6 chiffres');
    }
    if (isWeakPin(input.newPin)) {
      return fail('PIN_WEAK', 'Choisissez un PIN plus difficile à deviner');
    }
    if (!(await hasStoredPin())) {
      await ensureDemoPin(DEMO_PIN);
    }
    const currentOk = await verifyStoredPin(input.currentPin);
    if (!currentOk && input.currentPin !== DEMO_PIN) {
      return fail('PIN_INVALID', 'PIN actuel incorrect');
    }
    if (input.newPin === input.currentPin) {
      return fail('PIN_SAME', 'Le nouveau PIN doit être différent');
    }
    await savePin(input.newPin);
    setMockUser({...mockUser, hasPin: true});
    return ok({hasPin: true});
  },
};
