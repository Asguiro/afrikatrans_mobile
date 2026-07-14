import type {
  Beneficiary,
  Country,
  KycProfile,
  Operator,
  Quote,
  Transaction,
  UserProfile,
} from '../../types/api';

export const mockCountries: Country[] = [
  {code: 'SN', name: 'Sénégal', dialCode: '+221', currency: 'XOF'},
  {code: 'CI', name: "Côte d'Ivoire", dialCode: '+225', currency: 'XOF'},
  {code: 'ML', name: 'Mali', dialCode: '+223', currency: 'XOF'},
  {code: 'BF', name: 'Burkina Faso', dialCode: '+226', currency: 'XOF'},
];

export const mockOperators: Operator[] = [
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
    status: 'MAINTENANCE',
  },
  {
    id: 'op-moov-ci',
    code: 'MOOV',
    name: 'Moov Money',
    countryCode: 'CI',
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
  kycStatus: 'APPROVED',
  hasPin: true,
  biometricEnabled: false,
};

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
    phone: '+2250500987654',
    countryCode: 'CI',
    operatorId: 'op-moov-ci',
    operatorName: 'Moov Money',
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
