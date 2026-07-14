import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {
  authApi,
  beneficiaryApi,
  catalogApi,
  kycApi,
  transferApi,
} from '../services/api';
import {unwrap} from '../services/api/helpers';

export const queryKeys = {
  me: ['me'] as const,
  countries: ['countries'] as const,
  operators: (country?: string) => ['operators', country] as const,
  beneficiaries: ['beneficiaries'] as const,
  transactions: ['transactions'] as const,
  transaction: (id: string) => ['transaction', id] as const,
  quote: (id: string) => ['quote', id] as const,
  kyc: ['kyc'] as const,
};

export function useMeQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: async () => unwrap(await authApi.me()),
    enabled,
  });
}

export function useCountriesQuery() {
  return useQuery({
    queryKey: queryKeys.countries,
    queryFn: async () => unwrap(await catalogApi.listCountries()),
  });
}

export function useOperatorsQuery(countryCode?: string) {
  return useQuery({
    queryKey: queryKeys.operators(countryCode),
    queryFn: async () => unwrap(await catalogApi.listOperators(countryCode)),
    enabled: Boolean(countryCode),
  });
}

export function useBeneficiariesQuery() {
  return useQuery({
    queryKey: queryKeys.beneficiaries,
    queryFn: async () => unwrap(await beneficiaryApi.list()),
  });
}

export function useTransactionsQuery() {
  return useQuery({
    queryKey: queryKeys.transactions,
    queryFn: async () => unwrap(await transferApi.listTransactions()),
  });
}

export function useTransactionQuery(id: string, poll = false) {
  return useQuery({
    queryKey: queryKeys.transaction(id),
    queryFn: async () => unwrap(await transferApi.getTransaction(id)),
    refetchInterval: query => {
      if (!poll) {
        return false;
      }
      const status = query.state.data?.status;
      return status === 'COMPLETED' || status === 'FAILED' || status === 'CANCELLED'
        ? false
        : 1000;
    },
  });
}

export function useKycQuery() {
  return useQuery({
    queryKey: queryKeys.kyc,
    queryFn: async () => unwrap(await kycApi.getProfile()),
    refetchInterval: query =>
      query.state.data?.status === 'IN_REVIEW' ? 1500 : false,
  });
}

export function useCreateQuoteMutation() {
  return useMutation({
    mutationFn: async (
      input: Parameters<typeof transferApi.createQuote>[0],
    ) => unwrap(await transferApi.createQuote(input)),
  });
}

export function useCreateTransactionMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (
      input: Parameters<typeof transferApi.createTransaction>[0],
    ) => unwrap(await transferApi.createTransaction(input)),
    onSuccess: () => {
      qc.invalidateQueries({queryKey: queryKeys.transactions});
    },
  });
}

export function useUpsertBeneficiaryMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (
      input: Parameters<typeof beneficiaryApi.upsert>[0],
    ) => unwrap(await beneficiaryApi.upsert(input)),
    onSuccess: () => {
      qc.invalidateQueries({queryKey: queryKeys.beneficiaries});
    },
  });
}

export function useDeleteBeneficiaryMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) =>
      unwrap(await beneficiaryApi.remove(id)),
    onSuccess: () => {
      qc.invalidateQueries({queryKey: queryKeys.beneficiaries});
    },
  });
}
