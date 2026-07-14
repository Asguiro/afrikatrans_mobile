import type {KycApi} from '../contracts';
import {httpRequest} from './client';

export const httpKycApi: KycApi = {
  getProfile: () => httpRequest('/kyc'),
  submitPersonalInfo: input =>
    httpRequest('/kyc/personal-info', {method: 'POST', body: input}),
  submitDocument: input =>
    httpRequest('/kyc/documents', {method: 'POST', body: input}),
  submitSelfie: () => httpRequest('/kyc/selfie', {method: 'POST', body: {}}),
};
