// Shared technical envelope types matching docs/10-openapi.yaml `ErrorResponse`.
// Resource-specific types (Lead, Case, Appointment, ...) belong in each feature's
// own `types.ts` once that feature is implemented — not here.

export interface ApiErrorResponse {
  error: string;
  message: string;
  status: number;
}
