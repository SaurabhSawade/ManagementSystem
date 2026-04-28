import { z } from "zod";
import { ROLES } from "../constants/roles";

const roleSchema = z.nativeEnum(ROLES);

const createUserSchema = z.object({
  body: z.object({
    username: z.string().min(3),
    email: z.string().email().optional(),
    phone: z.string().min(8).optional(),
    password: z.string().min(6),
    roles: z.array(roleSchema).min(1),
    studentProfile: z
      .object({
        rollNumber: z.string().min(1).max(50),
        classRoomId: z.string().uuid(),
        guardianName: z.string().min(2).max(100).optional(),
      })
      .optional(),
    teacherProfile: z
      .object({
        employeeId: z.string().min(1).max(50),
        department: z.string().min(2).max(100).optional(),
      })
      .optional(),
  }),
});

const blockUserSchema = z.object({
  params: z.object({
    userId: z.string().uuid(),
  }),
  body: z.object({
    reason: z.string().min(3),
  }),
});

const toggleUserBlockSchema = z.object({
  params: z.object({
    userId: z.string().uuid(),
  }),
  body: z
    .object({
      isBlocked: z.boolean().optional(),
      reason: z.string().min(3).optional(),
    })
    .optional(),
});

const resetUserPasswordSchema = z.object({
  params: z.object({
    userId: z.string().uuid(),
  }),
  body: z.object({
    newPassword: z.string().min(6),
  }),
});

const setUserRolesSchema = z.object({
  params: z.object({
    userId: z.string().uuid(),
  }),
  body: z.object({
    roles: z.array(roleSchema).min(1),
  }),
});

const userValidation = {
  createUserSchema,
  blockUserSchema,
  toggleUserBlockSchema,
  resetUserPasswordSchema,
  setUserRolesSchema,
};

export default userValidation;
