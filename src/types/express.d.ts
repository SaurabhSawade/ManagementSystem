import { RoleCode } from "../constants/roles";

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        username: string;
        email?: string;
        phone?: string;
        roles: RoleCode[];
        jti: string;
      };
    }
  }
}

export {};
