import type {BeneficiaryApi} from '../contracts';
import {httpRequest} from './client';

export const httpBeneficiaryApi: BeneficiaryApi = {
  list: () => httpRequest('/beneficiaries'),
  upsert: input => {
    if (input.id) {
      const {id, ...patch} = input;
      return httpRequest(`/beneficiaries/${id}`, {
        method: 'PATCH',
        body: patch,
      });
    }
    return httpRequest('/beneficiaries', {method: 'POST', body: input});
  },
  remove: id =>
    httpRequest(`/beneficiaries/${id}`, {method: 'DELETE'}),
};
