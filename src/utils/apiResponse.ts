import { ApiResponse, ResponseType } from "../types/api";

const buildResponse = <T>(params: {
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
    data: params.data ?? null,
  };
};

const apiResponse = {
  buildResponse,
};

export default apiResponse;
