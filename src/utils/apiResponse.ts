import { ApiResponse, ResponseType } from "../types/api";

export const buildResponse = <T>(params: {
  status: number;
  success: boolean;
  message: string;
  type: ResponseType;
  data?: T | null;
}): ApiResponse<T> => {
  return {
    status: params.status,
    success: params.success,
    message: params.message,
    type: params.type,
    data: params.data ?? null,
  };
};
