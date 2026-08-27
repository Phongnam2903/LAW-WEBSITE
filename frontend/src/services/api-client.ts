import { env } from "@/config/env";
import type { ApiErrorResponse } from "@/types/api";

const API_VERSION_PREFIX = "/api/v1";

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(body: ApiErrorResponse) {
    super(body.message);
    this.name = "ApiError";
    this.status = body.status;
    this.code = body.error;
  }
}

export interface ApiRequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  accessToken?: string;
}

/**
 * Thin fetch wrapper for the backend's `/api/v1` REST surface.
 * Resource-specific calls (leads, cases, ...) are added per-feature on top
 * of this — this file only owns request/response/error plumbing.
 */
export async function apiRequest<TResponse>(
  path: string,
  { body, accessToken, headers, ...init }: ApiRequestOptions = {}
): Promise<TResponse> {
  const response = await fetch(`${env.apiBaseUrl}${API_VERSION_PREFIX}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (response.status === 204) {
    return undefined as TResponse;
  }

  const payload = await response.json().catch(() => undefined);

  if (!response.ok) {
    throw new ApiError(
      payload ?? {
        error: "unknown_error",
        message: response.statusText,
        status: response.status,
      }
    );
  }

  return payload as TResponse;
}
