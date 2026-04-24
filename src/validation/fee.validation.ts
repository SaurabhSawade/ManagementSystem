import { z } from "zod";

const createFeeSchema = z.object({
  body: z.object({
    userId: z.string().uuid("Invalid user ID"),
    amount: z.number().positive("Amount must be positive"),
    dueDate: z.string().datetime(),
    description: z.string().max(500).optional(),
  }),
});

const updateFeeSchema = z.object({
  params: z.object({
    feeId: z.string().uuid("Invalid fee ID"),
  }),
  body: z.object({
    amount: z.number().positive().optional(),
    dueDate: z.string().datetime().optional(),
    status: z.enum(["PENDING", "PAID", "PARTIAL", "OVERDUE"]).optional(),
    description: z.string().max(500).optional(),
  }),
});

const getFeeSchema = z.object({
  params: z.object({
    feeId: z.string().uuid("Invalid fee ID"),
  }),
});

const listFeesSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    userId: z.string().uuid().optional(),
    status: z.enum(["PENDING", "PAID", "PARTIAL", "OVERDUE"]).optional(),
    dateFrom: z.string().datetime().optional(),
    dateTo: z.string().datetime().optional(),
    sortBy: z.enum(["dueDate", "amount", "status", "createdAt"]).default("dueDate"),
    sortOrder: z.enum(["asc", "desc"]).default("asc"),
  }),
});

const markFeeAsPaidSchema = z.object({
  params: z.object({
    feeId: z.string().uuid("Invalid fee ID"),
  }),
  body: z.object({
    paidAmount: z.number().positive("Paid amount must be positive"),
    paymentMethod: z.enum(["CASH", "CHEQUE", "ONLINE", "BANK_TRANSFER"]).optional(),
  }),
});

const feeValidation = {
  createFeeSchema,
  updateFeeSchema,
  getFeeSchema,
  listFeesSchema,
  markFeeAsPaidSchema,
};

export default feeValidation;
