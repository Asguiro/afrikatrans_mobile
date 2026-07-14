/**
 * Runtime config. Prefer mocks until Nest `/api/v1` is available.
 * Flip USE_MOCKS to false and set API_BASE_URL when the backend is ready.
 */
export const env = {
  USE_MOCKS: true,
  API_BASE_URL: 'https://api.afrikatrans.local/api/v1',
  QUOTE_TTL_MS: 5 * 60 * 1000,
  MOCK_LATENCY_MS: 400,
} as const;
