import { ResponseType } from "../types/api";

export class AppError extends Error {
  public readonly status: number;
  public readonly type: ResponseType;

  constructor(status: number, message: string, type: ResponseType) {
    super(message);
    this.status = status;
    this.type = type;
  }
}
