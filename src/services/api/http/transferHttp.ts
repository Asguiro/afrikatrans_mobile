import type {TransferApi} from '../contracts';
import {httpRequest} from './client';

export const httpTransferApi: TransferApi = {
  createQuote: input =>
    httpRequest('/quotes', {method: 'POST', body: input}),
  getQuote: id => httpRequest(`/quotes/${id}`),
  createTransaction: input =>
    httpRequest('/transactions', {
      method: 'POST',
      body: {
        quoteId: input.quoteId,
        beneficiaryId: input.beneficiaryId,
        purpose: input.purpose,
      },
      idempotencyKey: input.idempotencyKey,
    }),
  listTransactions: () => httpRequest('/transactions'),
  getTransaction: id => httpRequest(`/transactions/${id}`),
};
