import type {KycApi} from '../api/contracts';
import {delay, ok} from '../api/helpers';
import {mockKyc, mockUser, setMockKyc, setMockUser} from './fixtures';

export const mockKycApi: KycApi = {
  async getProfile() {
    await delay();
    return ok(mockKyc);
  },

  async submitPersonalInfo(input) {
    await delay();
    const next = {
      ...mockKyc,
      ...input,
      status: 'PENDING' as const,
    };
    setMockKyc(next);
    setMockUser({...mockUser, kycStatus: 'PENDING', firstName: input.firstName, lastName: input.lastName});
    return ok(next);
  },

  async submitDocument(input) {
    await delay();
    const next = {
      ...mockKyc,
      documentType: input.documentType,
      status: 'IN_REVIEW' as const,
    };
    setMockKyc(next);
    setMockUser({...mockUser, kycStatus: 'IN_REVIEW'});
    return ok(next);
  },

  async submitSelfie() {
    await delay();
    const next = {
      ...mockKyc,
      status: 'IN_REVIEW' as const,
      dailyLimit: 100000,
      monthlyLimit: 500000,
      currency: 'XOF',
    };
    setMockKyc(next);
    setMockUser({...mockUser, kycStatus: 'IN_REVIEW'});
    // Simulate async approval
    setTimeout(() => {
      setMockKyc({
        ...next,
        status: 'APPROVED',
        dailyLimit: 500000,
        monthlyLimit: 2000000,
      });
      setMockUser({...mockUser, kycStatus: 'APPROVED'});
    }, 2500);
    return ok(next);
  },
};
