import type {AuthApi} from '../api/contracts';
import {createId, delay, fail, ok} from '../api/helpers';
import {mockUser, setMockUser} from './fixtures';
import {savePin, verifyStoredPin} from '../secureStorage';

const DEMO_OTP = '123456';
const DEMO_PASSWORD = 'Demo1234!';

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
      kycStatus: 'NONE',
      hasPin: false,
    });
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
    if (input.password !== DEMO_PASSWORD && input.password.length < 6) {
      return fail('AUTH_INVALID', 'Identifiants incorrects');
    }
    const tokens = {
      accessToken: createId('access'),
      refreshToken: createId('refresh'),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    };
    return ok({user: {...mockUser, phone: input.phone}, tokens});
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

  async setPin(pin) {
    await delay();
    if (!/^\d{4,6}$/.test(pin)) {
      return fail('PIN_INVALID', 'Le PIN doit contenir 4 à 6 chiffres');
    }
    await savePin(pin);
    setMockUser({...mockUser, hasPin: true});
    return ok({hasPin: true});
  },

  async verifyPin(pin) {
    await delay();
    const valid = await verifyStoredPin(pin);
    if (!valid && pin !== '1234') {
      return fail('PIN_INVALID', 'PIN incorrect');
    }
    return ok({valid: true});
  },
};
