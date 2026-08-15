/**
 * Runtime config.
 * Pour tester sur device physique : USE_MOCKS=false et
 * API_BASE_URL=http://<IP_LAN_DU_MAC>:3000/api/v1
 * (le téléphone et le Mac doivent être sur le même Wi‑Fi).
 */
export const env = {
  USE_MOCKS: true,
  /** Base avec /api/v1 — les clients HTTP ajoutent /auth, /quotes, etc. */
  API_BASE_URL: 'http://localhost:3000/api/v1',
  QUOTE_TTL_MS: 5 * 60 * 1000,
  MOCK_LATENCY_MS: 400,
  /** PIN de déverrouillage en mode mock uniquement. */
  DEMO_PIN: '1234',
} as const;
