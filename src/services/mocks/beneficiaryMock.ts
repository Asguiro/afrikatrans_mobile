import type {BeneficiaryApi} from '../api/contracts';
import {createId, delay, fail, ok} from '../api/helpers';
import {
  mockBeneficiaries,
  mockOperators,
  removeBeneficiary,
  upsertBeneficiary,
} from './fixtures';

export const mockBeneficiaryApi: BeneficiaryApi = {
  async list() {
    await delay();
    return ok(mockBeneficiaries);
  },

  async upsert(input) {
    await delay();
    const operator = mockOperators.find(o => o.id === input.operatorId);
    if (!operator) {
      return fail('OPERATOR_NOT_FOUND', 'Opérateur introuvable');
    }
    const beneficiary = {
      id: input.id ?? createId('ben'),
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone,
      countryCode: input.countryCode,
      operatorId: input.operatorId,
      operatorName: operator.name,
      favorite: input.favorite ?? false,
    };
    upsertBeneficiary(beneficiary);
    return ok(beneficiary);
  },

  async remove(id) {
    await delay();
    removeBeneficiary(id);
    return ok({deleted: true});
  },
};
