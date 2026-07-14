export type ApiSuccess<T> = {
  data: T;
  meta?: Record<string, unknown> | null;
  error: null;
};

export type ApiErrorBody = {
  code: string;
  message: string;
  details?: unknown;
};

export type ApiFailure = {
  data: null;
  meta?: Record<string, unknown> | null;
  error: ApiErrorBody;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export class ApiError extends Error {
  readonly code: string;
  readonly details?: unknown;

  constructor(error: ApiErrorBody) {
    super(error.message);
    this.name = 'ApiError';
    this.code = error.code;
    this.details = error.details;
  }
}

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
};

export type UserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  countryCode: string;
  email?: string | null;
  kycStatus: KycStatus;
  hasPin: boolean;
  biometricEnabled: boolean;
};

export type KycStatus =
  | 'NONE'
  | 'PENDING'
  | 'IN_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'NEEDS_RESUBMISSION';

export type Country = {
  code: string;
  name: string;
  dialCode: string;
  currency: string;
};

export type Operator = {
  id: string;
  code: string;
  name: string;
  countryCode: string;
  status: 'AVAILABLE' | 'MAINTENANCE' | 'UNAVAILABLE';
};

export type Beneficiary = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  countryCode: string;
  operatorId: string;
  operatorName: string;
  favorite: boolean;
};

export type Quote = {
  id: string;
  sourceCountryCode: string;
  sourceOperatorId: string;
  sourceCurrency: string;
  destinationCountryCode: string;
  destinationOperatorId: string;
  destinationCurrency: string;
  sendAmount: number;
  receiveAmount: number;
  feeAmount: number;
  totalDebitAmount: number;
  fxRate: number;
  expiresAt: string;
  estimatedDeliveryMinutes: number;
};

export type TransactionStatus =
  | 'CREATED'
  | 'PENDING_DEBIT'
  | 'DEBITED'
  | 'PENDING_PAYOUT'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED';

export type Transaction = {
  id: string;
  reference: string;
  status: TransactionStatus;
  quoteId: string;
  beneficiaryId: string;
  beneficiaryName: string;
  sourceCountryCode: string;
  destinationCountryCode: string;
  sourceOperatorName: string;
  destinationOperatorName: string;
  sendAmount: number;
  receiveAmount: number;
  feeAmount: number;
  totalDebitAmount: number;
  sourceCurrency: string;
  destinationCurrency: string;
  fxRate: number;
  createdAt: string;
  updatedAt: string;
  failureReason?: string | null;
};

export type KycProfile = {
  status: KycStatus;
  firstName?: string;
  lastName?: string;
  addressLine?: string;
  city?: string;
  documentType?: 'PASSPORT' | 'NATIONAL_ID' | 'RESIDENCE_PERMIT';
  rejectionReason?: string | null;
  dailyLimit?: number | null;
  monthlyLimit?: number | null;
  currency?: string | null;
};
