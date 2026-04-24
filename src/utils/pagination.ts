export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

/**
 * Calculate skip value for database queries
 */
export const calculateSkip = (page: number, limit: number): number => {
  return (page - 1) * limit;
};

/**
 * Generate pagination metadata
 */
export const generatePaginationMeta = (
  page: number,
  limit: number,
  total: number,
): PaginationMeta => {
  const pages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    pages,
    hasNext: page < pages,
    hasPrev: page > 1,
  };
};

/**
 * Format paginated response
 */
export const formatPaginatedResponse = <T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
): PaginatedResponse<T> => {
  return {
    data,
    meta: generatePaginationMeta(page, limit, total),
  };
};

/**
 * Build search filter for text fields
 */
export const buildTextFilter = (search: string, fields: string[]): any => {
  if (!search) return {};

  return {
    OR: fields.map((field) => ({
      [field]: { contains: search, mode: "insensitive" },
    })),
  };
};

/**
 * Build date range filter
 */
export const buildDateRangeFilter = (
  dateFrom?: Date | null,
  dateTo?: Date | null,
): any => {
  if (!dateFrom && !dateTo) return {};

  const dateFilter: any = {};
  if (dateFrom) dateFilter.gte = dateFrom;
  if (dateTo) dateFilter.lte = dateTo;

  return dateFilter;
};

/**
 * Validate sort parameters
 */
export const validateSortParams = (
  sortBy: string,
  sortOrder: string,
  allowedFields: string[],
): { sortBy: string; sortOrder: "asc" | "desc" } => {
  const validSortBy: string = allowedFields.includes(sortBy) ? sortBy : allowedFields[0];
  const validSortOrder: "asc" | "desc" = sortOrder === "desc" ? "desc" : "asc";

  return {
    sortBy: validSortBy,
    sortOrder: validSortOrder,
  };
};

const paginationUtils = {
  calculateSkip,
  generatePaginationMeta,
  formatPaginatedResponse,
  buildTextFilter,
  buildDateRangeFilter,
  validateSortParams,
};

export default paginationUtils;
