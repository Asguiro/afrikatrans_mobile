import type {
  Beneficiary,
  Country,
  KycProfile,
  Operator,
  Quote,
  Transaction,
  UserProfile,
} from '../../types/api';

/**
 * Pays MVP : Mali, Sénégal, Côte d’Ivoire, Gabon, Centrafrique.
 * Devises / indicatifs alignés usage Mobile Money (XOF / XAF).
 */
export const mockCountries: Country[] = [
  {code: 'ML', name: 'Mali', dialCode: '+223', currency: 'XOF'},
  {code: 'SN', name: 'Sénégal', dialCode: '+221', currency: 'XOF'},
  {code: "CI", name: "Côte d'Ivoire", dialCode: '+225', currency: 'XOF'},
  {code: 'GA', name: 'Gabon', dialCode: '+241', currency: 'XAF'},
  {code: 'CF', name: 'Centrafrique', dialCode: '+236', currency: 'XAF'},
];

/**
 * Opérateurs mock par pays (codes marque → mapping AfribaPay plus tard :
 * orange, wave, mtn, moov, free, airtel ; sama à confirmer).
 */
export const mockOperators: Operator[] = [
  // Sénégal
  {
    id: 'op-wave-sn',
    code: 'WAVE',
    name: 'Wave',
    countryCode: 'SN',
    status: 'AVAILABLE',
  },
  {
    id: 'op-orange-sn',
    code: 'ORANGE',
    name: 'Orange Money',
    countryCode: 'SN',
    status: 'AVAILABLE',
  },
  {
    id: 'op-free-sn',
    code: 'FREE',
    name: 'Free Money',
    countryCode: 'SN',
    status: 'AVAILABLE',
  },
  // Côte d'Ivoire
  {
    id: 'op-orange-ci',
    code: 'ORANGE',
    name: 'Orange Money',
    countryCode: 'CI',
    status: 'AVAILABLE',
  },
  {
    id: 'op-mtn-ci',
    code: 'MTN',
    name: 'MTN MoMo',
    countryCode: 'CI',
    status: 'AVAILABLE',
  },
  {
    id: 'op-moov-ci',
    code: 'MOOV',
    name: 'Moov Money',
    countryCode: 'CI',
    status: 'AVAILABLE',
  },
  {
    id: 'op-wave-ci',
    code: 'WAVE',
    name: 'Wave',
    countryCode: 'CI',
    status: 'AVAILABLE',
  },
  // Mali
  {
    id: 'op-orange-ml',
    code: 'ORANGE',
    name: 'Orange Money',
    countryCode: 'ML',
    status: 'AVAILABLE',
  },
  {
    id: 'op-moov-ml',
    code: 'MOOV',
    name: 'Moov Money',
    countryCode: 'ML',
    status: 'AVAILABLE',
  },
  {
    id: 'op-sama-ml',
    code: 'SAMA',
    name: 'Sama Money',
    countryCode: 'ML',
    status: 'AVAILABLE',
  },
  // Gabon
  {
    id: 'op-airtel-ga',
    code: 'AIRTEL',
    name: 'Airtel Money',
    countryCode: 'GA',
    status: 'AVAILABLE',
  },
  {
    id: 'op-moov-ga',
    code: 'MOOV',
    name: 'Moov Money',
    countryCode: 'GA',
    status: 'AVAILABLE',
  },
  // Centrafrique
  {
    id: 'op-orange-cf',
    code: 'ORANGE',
    name: 'Orange Money',
    countryCode: 'CF',
    status: 'AVAILABLE',
  },
  {
    id: 'op-moov-cf',
    code: 'MOOV',
    name: 'Moov Money',
    countryCode: 'CF',
    status: 'AVAILABLE',
  },
];

export let mockUser: UserProfile = {
  id: 'usr_demo_1',
  firstName: 'Amadou',
  lastName: 'Diallo',
  phone: '+221771234567',
  countryCode: 'SN',
  email: 'amadou.diallo@example.com',
  avatarUrl: null,
  kycStatus: 'APPROVED',
  hasPin: true,
  biometricEnabled: false,
};

import {env} from '../../config/env';

/** Mot de passe démo mutable (jamais exposé hors couche mock). */
export let mockPassword = 'Demo1234!';

/** PIN de déverrouillage démo (mock uniquement). */
export const DEMO_PIN = env.DEMO_PIN;

export function setMockPassword(password: string) {
  mockPassword = password;
}

export let mockKyc: KycProfile = {
  status: 'APPROVED',
  firstName: 'Amadou',
  lastName: 'Diallo',
  addressLine: 'Médina',
  city: 'Dakar',
  documentType: 'NATIONAL_ID',
  rejectionReason: null,
  dailyLimit: 500000,
  monthlyLimit: 2000000,
  currency: 'XOF',
};

export let mockBeneficiaries: Beneficiary[] = [
  {
    id: 'ben_1',
    firstName: 'Aïcha',
    lastName: 'Koné',
    phone: '+2250700123456',
    countryCode: 'CI',
    operatorId: 'op-orange-ci',
    operatorName: 'Orange Money',
    favorite: true,
  },
  {
    id: 'ben_2',
    firstName: 'Ibrahim',
    lastName: 'Traoré',
    phone: '+22376001234',
    countryCode: 'ML',
    operatorId: 'op-orange-ml',
    operatorName: 'Orange Money',
    favorite: false,
  },
];

export let mockQuotes: Quote[] = [];
export let mockTransactions: Transaction[] = [
  {
    id: 'txn_seed_1',
    reference: 'AT-20260713-001',
    status: 'COMPLETED',
    quoteId: 'quote_seed_1',
    beneficiaryId: 'ben_1',
    beneficiaryName: 'Aïcha Koné',
    sourceCountryCode: 'SN',
    destinationCountryCode: 'CI',
    sourceOperatorName: 'Wave',
    destinationOperatorName: 'Orange Money',
    sourceAccountPhone: '+221771234567',
    destinationPhone: '+2250700123456',
    sendAmount: 25000,
    receiveAmount: 24350,
    feeAmount: 650,
    totalDebitAmount: 25650,
    sourceCurrency: 'XOF',
    destinationCurrency: 'XOF',
    fxRate: 1,
    createdAt: '2026-07-10T10:15:00.000Z',
    updatedAt: '2026-07-10T10:18:00.000Z',
  },
];

export function setMockUser(user: UserProfile) {
  mockUser = user;
}

export function setMockKyc(kyc: KycProfile) {
  mockKyc = kyc;
}

export function upsertBeneficiary(beneficiary: Beneficiary) {
  const idx = mockBeneficiaries.findIndex(b => b.id === beneficiary.id);
  if (idx >= 0) {
    mockBeneficiaries[idx] = beneficiary;
  } else {
    mockBeneficiaries = [beneficiary, ...mockBeneficiaries];
  }
}

export function removeBeneficiary(id: string) {
  mockBeneficiaries = mockBeneficiaries.filter(b => b.id !== id);
}

export function addQuote(quote: Quote) {
  mockQuotes = [quote, ...mockQuotes];
}

export function addTransaction(txn: Transaction) {
  mockTransactions = [txn, ...mockTransactions];
}

export function updateTransaction(id: string, patch: Partial<Transaction>) {
  mockTransactions = mockTransactions.map(t =>
    t.id === id ? {...t, ...patch, updatedAt: new Date().toISOString()} : t,
  );
}
