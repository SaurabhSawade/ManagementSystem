import { z } from "zod";

const listAuditLogsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    action: z.string().max(100).optional(),
    actorId: z.string().uuid().optional(),
    targetId: z.string().uuid().optional(),
    dateFrom: z.string().datetime().optional(),
    dateTo: z.string().datetime().optional(),
    sortBy: z.enum(["createdAt", "action"]).default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
  }),
});

const getAuditLogSchema = z.object({
  params: z.object({
    auditId: z.string().uuid("Invalid audit ID"),
  }),
});

const auditValidation = {
  listAuditLogsSchema,
  getAuditLogSchema,
};

export default auditValidation;
