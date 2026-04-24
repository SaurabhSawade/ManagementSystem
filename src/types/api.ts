export type ResponseType =
  | "SUCCESS"
  | "VALIDATION_ERROR"
  | "AUTH_ERROR"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "SERVER_ERROR";

export interface ApiResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data: T | null;
}

export interface AuthTokenPayload {
  userId: string;
  email?: string;
  phone?: string;
  username: string;
  roles: string[];
  jti: string;
}
