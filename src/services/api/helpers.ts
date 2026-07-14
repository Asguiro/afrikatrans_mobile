import {env} from '../../config/env';
import {
  ApiError,
  ApiResponse,
  ApiSuccess,
} from '../../types/api';

export function ok<T>(data: T, meta?: Record<string, unknown>): ApiSuccess<T> {
  return {data, meta: meta ?? null, error: null};
}

export function fail(
  code: string,
  message: string,
  details?: unknown,
): ApiResponse<never> {
  return {
    data: null,
    meta: null,
    error: {code, message, details},
  };
}

export async function delay(ms = env.MOCK_LATENCY_MS): Promise<void> {
  await new Promise<void>(resolve => {
    setTimeout(resolve, ms);
  });
}

export function unwrap<T>(response: ApiResponse<T>): T {
  if (response.error) {
    throw new ApiError(response.error);
  }
  return response.data;
}

export function createId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
