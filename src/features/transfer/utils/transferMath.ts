import type {Operator} from '../../../types/api';

/**
 * Résout un opérateur concret (pays + marque).
 * Préférence : AVAILABLE, sinon premier match (le UI bloquera si maintenance).
 */
export function resolveOperator(
  operators: Operator[],
  countryCode: string,
  brandCode: string,
): Operator | undefined {
  const matches = operators.filter(
    o => o.countryCode === countryCode && o.code === brandCode,
  );
  return (
    matches.find(o => o.status === 'AVAILABLE') ?? matches[0] ?? undefined
  );
}

/** Opérateur source : préfère Wave, sinon premier AVAILABLE du pays. */
export function resolveSourceOperator(
  operators: Operator[],
  countryCode: string,
  preferredBrand = 'WAVE',
): Operator | undefined {
  const inCountry = operators.filter(o => o.countryCode === countryCode);
  const preferred = inCountry.find(
    o => o.code === preferredBrand && o.status === 'AVAILABLE',
  );
  if (preferred) {
    return preferred;
  }
  return inCountry.find(o => o.status === 'AVAILABLE') ?? inCountry[0];
}

/**
 * Estimation locale (alignée sur le mock serveur).
 * Les règles métier définitives resteront côté API.
 */
export function estimateTransferAmounts(
  amount: number,
  mode: 'SEND' | 'RECEIVE',
): {
  sendAmount: number;
  receiveAmount: number;
  feeAmount: number;
  totalDebitAmount: number;
} {
  if (!amount || amount <= 0) {
    return {
      sendAmount: 0,
      receiveAmount: 0,
      feeAmount: 0,
      totalDebitAmount: 0,
    };
  }

  if (mode === 'SEND') {
    const sendAmount = amount;
    const feeAmount = Math.max(200, Math.round(sendAmount * 0.026));
    const receiveAmount = Math.max(0, sendAmount - feeAmount);
    return {
      sendAmount,
      receiveAmount,
      feeAmount,
      totalDebitAmount: sendAmount,
    };
  }

  const receiveAmount = amount;
  const feeAmount = Math.max(200, Math.round(receiveAmount * 0.026));
  return {
    sendAmount: receiveAmount,
    receiveAmount,
    feeAmount,
    totalDebitAmount: receiveAmount + feeAmount,
  };
}
