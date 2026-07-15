import {env} from '../../config/env';
import type {
  AuthApi,
  BeneficiaryApi,
  CatalogApi,
  KycApi,
  TransferApi,
} from './contracts';
import {mockAuthApi} from '../mocks/authMock';
import {mockCatalogApi} from '../mocks/catalogMock';
import {mockTransferApi} from '../mocks/transferMock';
import {mockBeneficiaryApi} from '../mocks/beneficiaryMock';
import {mockKycApi} from '../mocks/kycMock';
import {httpAuthApi} from './http/authHttp';
import {httpCatalogApi} from './http/catalogHttp';
import {httpTransferApi} from './http/transferHttp';
import {httpBeneficiaryApi} from './http/beneficiaryHttp';
import {httpKycApi} from './http/kycHttp';

export type {
  AuthApi,
  BeneficiaryApi,
  CatalogApi,
  ChangePasswordInput,
  ChangePinInput,
  CreateQuoteInput,
  CreateTransactionInput,
  KycApi,
  LoginInput,
  RegisterInput,
  TransferApi,
  UpdateMeInput,
  UpsertBeneficiaryInput,
} from './contracts';

const useMocks = env.USE_MOCKS;

export const authApi: AuthApi = useMocks ? mockAuthApi : httpAuthApi;
export const catalogApi: CatalogApi = useMocks
  ? mockCatalogApi
  : httpCatalogApi;
export const transferApi: TransferApi = useMocks
  ? mockTransferApi
  : httpTransferApi;
export const beneficiaryApi: BeneficiaryApi = useMocks
  ? mockBeneficiaryApi
  : httpBeneficiaryApi;
export const kycApi: KycApi = useMocks ? mockKycApi : httpKycApi;
