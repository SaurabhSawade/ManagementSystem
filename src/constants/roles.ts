export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  STUDENT: "STUDENT",
  TEACHER: "TEACHER",
  ACCOUNTANT: "ACCOUNTANT",
  LIBRARY_STAFF: "LIBRARY_STAFF",
} as const;

export type RoleCode = (typeof ROLES)[keyof typeof ROLES];
