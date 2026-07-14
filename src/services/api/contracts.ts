import type {
  ApiResponse,
  AuthTokens,
  Beneficiary,
  Country,
  KycProfile,
  Operator,
  Quote,
  Transaction,
  UserProfile,
} from '../../types/api';

export type RegisterInput = {
  countryCode: string;
  phone: string;
  firstName: string;
  lastName: string;
  password: string;
};

export type LoginInput = {
  phone: string;
  password: string;
};

export type CreateQuoteInput = {
  sourceCountryCode: string;
  sourceOperatorId: string;
  destinationCountryCode: string;
  destinationOperatorId: string;
  amountMode: 'SEND' | 'RECEIVE';
  amount: number;
};

export type CreateTransactionInput = {
  quoteId: string;
  beneficiaryId: string;
  purpose?: string;
  idempotencyKey: string;
};

export type UpsertBeneficiaryInput = {
  id?: string;
  firstName: string;
  lastName: string;
  phone: string;
  countryCode: string;
  operatorId: string;
  favorite?: boolean;
};

export type AuthApi = {
  register: (input: RegisterInput) => Promise<ApiResponse<{userId: string}>>;
  verifyOtp: (input: {
    phone: string;
    code: string;
  }) => Promise<ApiResponse<{verified: boolean}>>;
  login: (
    input: LoginInput,
  ) => Promise<ApiResponse<{user: UserProfile; tokens: AuthTokens}>>;
  refresh: (
    refreshToken: string,
  ) => Promise<ApiResponse<{tokens: AuthTokens}>>;
  me: () => Promise<ApiResponse<UserProfile>>;
  setPin: (pin: string) => Promise<ApiResponse<{hasPin: boolean}>>;
  verifyPin: (pin: string) => Promise<ApiResponse<{valid: boolean}>>;
};

export type CatalogApi = {
  listCountries: () => Promise<ApiResponse<Country[]>>;
  listOperators: (countryCode?: string) => Promise<ApiResponse<Operator[]>>;
};

export type TransferApi = {
  createQuote: (input: CreateQuoteInput) => Promise<ApiResponse<Quote>>;
  getQuote: (id: string) => Promise<ApiResponse<Quote>>;
  createTransaction: (
    input: CreateTransactionInput,
  ) => Promise<ApiResponse<Transaction>>;
  listTransactions: () => Promise<ApiResponse<Transaction[]>>;
  getTransaction: (id: string) => Promise<ApiResponse<Transaction>>;
};

export type BeneficiaryApi = {
  list: () => Promise<ApiResponse<Beneficiary[]>>;
  upsert: (input: UpsertBeneficiaryInput) => Promise<ApiResponse<Beneficiary>>;
  remove: (id: string) => Promise<ApiResponse<{deleted: boolean}>>;
};

export type KycApi = {
  getProfile: () => Promise<ApiResponse<KycProfile>>;
  submitPersonalInfo: (input: {
    firstName: string;
    lastName: string;
    addressLine: string;
    city: string;
  }) => Promise<ApiResponse<KycProfile>>;
  submitDocument: (input: {
    documentType: 'PASSPORT' | 'NATIONAL_ID' | 'RESIDENCE_PERMIT';
  }) => Promise<ApiResponse<KycProfile>>;
  submitSelfie: () => Promise<ApiResponse<KycProfile>>;
};
