import { Router } from "express";
import bookController from "../../../../controller/book.controller";
import { PERMISSIONS } from "../../../../constants/permissions";
import { ROLES } from "../../../../constants/roles";
import authMiddleware from "../../../../middleware/auth.middleware";
import rbacMiddleware from "../../../../middleware/rbac.middleware";
import validateMiddleware from "../../../../middleware/validate.middleware";
import bookValidation from "../../../../validation/book.validation";

const bookRouter = Router();

bookRouter.use(authMiddleware.requireAuth);

bookRouter.post(
  "/",
  rbacMiddleware.requireRoles([ROLES.SUPER_ADMIN, ROLES.LIBRARY_STAFF]),
  rbacMiddleware.requirePermission(PERMISSIONS.BOOK_CREATE),
  validateMiddleware.validate(bookValidation.createBookSchema),
  bookController.createBook,
);

bookRouter.get(
  "/",
  rbacMiddleware.requirePermission(PERMISSIONS.BOOK_LIST),
  validateMiddleware.validate(bookValidation.listBooksSchema),
  bookController.listBooks,
);

bookRouter.get(
  "/:bookId",
  rbacMiddleware.requirePermission(PERMISSIONS.BOOK_READ),
  validateMiddleware.validate(bookValidation.getBookSchema),
  bookController.getBook,
);

bookRouter.patch(
  "/:bookId",
  rbacMiddleware.requireRoles([ROLES.SUPER_ADMIN, ROLES.LIBRARY_STAFF]),
  rbacMiddleware.requirePermission(PERMISSIONS.BOOK_UPDATE),
  validateMiddleware.validate(bookValidation.updateBookSchema),
  bookController.updateBook,
);

bookRouter.post(
  "/issue",
  rbacMiddleware.requireRoles([ROLES.SUPER_ADMIN, ROLES.LIBRARY_STAFF]),
  rbacMiddleware.requirePermission(PERMISSIONS.BOOK_ISSUE),
  validateMiddleware.validate(bookValidation.issueBookSchema),
  bookController.issueBook,
);

bookRouter.post(
  "/:bookIssueId/return",
  rbacMiddleware.requireRoles([ROLES.SUPER_ADMIN, ROLES.LIBRARY_STAFF]),
  rbacMiddleware.requirePermission(PERMISSIONS.BOOK_RETURN),
  validateMiddleware.validate(bookValidation.returnBookSchema),
  bookController.returnBook,
);

bookRouter.get(
  "/issues/list",
  rbacMiddleware.requirePermission(PERMISSIONS.BOOK_READ),
  validateMiddleware.validate(bookValidation.listBookIssuesSchema),
  bookController.listBookIssues,
);

bookRouter.get(
  "/issues/:bookIssueId",
  rbacMiddleware.requirePermission(PERMISSIONS.BOOK_READ),
  validateMiddleware.validate(bookValidation.getBookIssueSchema),
  bookController.getBookIssue,
);

export default bookRouter;
