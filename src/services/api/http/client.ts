import {env} from '../../../config/env';
import {useSessionStore} from '../../../stores/sessionStore';
import type {ApiResponse} from '../../../types/api';
import {ApiError} from '../../../types/api';

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  auth?: boolean;
  idempotencyKey?: string;
};

export async function httpRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  if (options.auth !== false) {
    const token = useSessionStore.getState().tokens?.accessToken;
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  if (options.idempotencyKey) {
    headers['Idempotency-Key'] = options.idempotencyKey;
  }

  const response = await fetch(`${env.API_BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  let payload: ApiResponse<T>;
  try {
    payload = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new ApiError({
      code: 'INVALID_RESPONSE',
      message: 'Réponse API invalide',
    });
  }

  if (!response.ok && payload.error) {
    throw new ApiError(payload.error);
  }

  return payload;
}
