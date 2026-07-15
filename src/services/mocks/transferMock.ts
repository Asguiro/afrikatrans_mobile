import {env} from '../../config/env';
import type {TransferApi} from '../api/contracts';
import {createId, delay, fail, ok} from '../api/helpers';
import type {Quote, Transaction} from '../../types/api';
import {
  addQuote,
  addTransaction,
  mockBeneficiaries,
  mockOperators,
  mockQuotes,
  mockTransactions,
  updateTransaction,
} from './fixtures';

/**
 * Mock pricing is illustrative only. Real fees/rates come from the backend.
 */
function buildMockQuote(
  input: Parameters<TransferApi['createQuote']>[0],
): Quote {
  const sourceOp = mockOperators.find(o => o.id === input.sourceOperatorId);
  const destOp = mockOperators.find(o => o.id === input.destinationOperatorId);
  /**
   * SEND : frais déduits du montant reçu (débit = montant saisi).
   * RECEIVE : destinataire reçoit le montant saisi ; frais sur le compte expéditeur.
   * Illustratif uniquement — tarifs réels côté backend.
   */
  let sendAmount: number;
  let receiveAmount: number;
  let feeAmount: number;
  let totalDebitAmount: number;

  if (input.amountMode === 'SEND') {
    sendAmount = input.amount;
    feeAmount = Math.max(200, Math.round(sendAmount * 0.026));
    receiveAmount = Math.max(0, sendAmount - feeAmount);
    totalDebitAmount = sendAmount;
  } else {
    receiveAmount = input.amount;
    feeAmount = Math.max(200, Math.round(receiveAmount * 0.026));
    sendAmount = receiveAmount;
    totalDebitAmount = receiveAmount + feeAmount;
  }

  const now = Date.now();

  return {
    id: createId('quote'),
    sourceCountryCode: input.sourceCountryCode,
    sourceOperatorId: input.sourceOperatorId,
    sourceCurrency: 'XOF',
    destinationCountryCode: input.destinationCountryCode,
    destinationOperatorId: input.destinationOperatorId,
    destinationCurrency: 'XOF',
    sendAmount,
    receiveAmount,
    feeAmount,
    totalDebitAmount,
    fxRate: 1,
    expiresAt: new Date(now + env.QUOTE_TTL_MS).toISOString(),
    estimatedDeliveryMinutes: sourceOp && destOp ? 5 : 15,
  };
}

export const mockTransferApi: TransferApi = {
  async createQuote(input) {
    await delay();
    if (input.amount <= 0) {
      return fail('AMOUNT_INVALID', 'Montant invalide');
    }
    const quote = buildMockQuote(input);
    addQuote(quote);
    return ok(quote);
  },

  async getQuote(id) {
    await delay();
    const quote = mockQuotes.find(q => q.id === id);
    if (!quote) {
      return fail('QUOTE_NOT_FOUND', 'Devis introuvable');
    }
    if (new Date(quote.expiresAt).getTime() < Date.now()) {
      return fail('QUOTE_EXPIRED', 'Devis expiré');
    }
    return ok(quote);
  },

  async createTransaction(input) {
    await delay();
    const quote = mockQuotes.find(q => q.id === input.quoteId);
    if (!quote) {
      return fail('QUOTE_NOT_FOUND', 'Devis introuvable');
    }
    if (new Date(quote.expiresAt).getTime() < Date.now()) {
      return fail('QUOTE_EXPIRED', 'Devis expiré, regénérez un devis');
    }
    const beneficiary = mockBeneficiaries.find(
      b => b.id === input.beneficiaryId,
    );
    if (!beneficiary) {
      return fail('BENEFICIARY_NOT_FOUND', 'Bénéficiaire introuvable');
    }

    const sourceOp = mockOperators.find(o => o.id === quote.sourceOperatorId);
    const destOp = mockOperators.find(
      o => o.id === quote.destinationOperatorId,
    );
    const now = new Date().toISOString();
    const txn: Transaction = {
      id: createId('txn'),
      reference: `AT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(
        Math.random() * 900 + 100,
      )}`,
      status: 'PENDING_DEBIT',
      quoteId: quote.id,
      beneficiaryId: beneficiary.id,
      beneficiaryName: `${beneficiary.firstName} ${beneficiary.lastName}`,
      sourceCountryCode: quote.sourceCountryCode,
      destinationCountryCode: quote.destinationCountryCode,
      sourceOperatorName: sourceOp?.name ?? 'Source',
      destinationOperatorName: destOp?.name ?? 'Destination',
      sourceAccountPhone: input.sourceAccountPhone,
      destinationPhone: beneficiary.phone,
      sendAmount: quote.sendAmount,
      receiveAmount: quote.receiveAmount,
      feeAmount: quote.feeAmount,
      totalDebitAmount: quote.totalDebitAmount,
      sourceCurrency: quote.sourceCurrency,
      destinationCurrency: quote.destinationCurrency,
      fxRate: quote.fxRate,
      createdAt: now,
      updatedAt: now,
    };
    addTransaction(txn);

    setTimeout(() => {
      updateTransaction(txn.id, {status: 'DEBITED'});
      setTimeout(() => {
        updateTransaction(txn.id, {status: 'PENDING_PAYOUT'});
        setTimeout(() => {
          updateTransaction(txn.id, {status: 'COMPLETED'});
        }, 800);
      }, 800);
    }, 800);

    return ok(txn);
  },

  async listTransactions() {
    await delay();
    return ok(mockTransactions);
  },

  async getTransaction(id) {
    await delay();
    const txn = mockTransactions.find(t => t.id === id);
    if (!txn) {
      return fail('TRANSACTION_NOT_FOUND', 'Transaction introuvable');
    }
    return ok(txn);
  },
};
