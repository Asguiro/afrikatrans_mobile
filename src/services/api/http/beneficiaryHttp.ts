import type {BeneficiaryApi} from '../contracts';
import {httpRequest} from './client';

export const httpBeneficiaryApi: BeneficiaryApi = {
  list: () => httpRequest('/beneficiaries'),
  upsert: input =>
    input.id
      ? httpRequest(`/beneficiaries/${input.id}`, {method: 'PATCH', body: input})
      : httpRequest('/beneficiaries', {method: 'POST', body: input}),
  remove: id =>
    httpRequest(`/beneficiaries/${id}`, {method: 'DELETE'}),
};
