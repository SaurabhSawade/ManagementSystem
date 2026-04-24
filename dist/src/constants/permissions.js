"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PERMISSIONS = void 0;
exports.PERMISSIONS = {
    // User Management
    USER_CREATE: "user:create",
    USER_READ: "user:read",
    USER_UPDATE: "user:update",
    USER_DELETE: "user:delete",
    USER_BLOCK: "user:block",
    USER_UNBLOCK: "user:unblock",
    USER_RESET_PASSWORD: "user:reset-password",
    // Admin Operations
    ADMIN_GRANT: "admin:grant",
    ADMIN_REVOKE: "admin:revoke",
    // Student Management
    STUDENT_CREATE: "student:create",
    STUDENT_READ: "student:read",
    STUDENT_UPDATE: "student:update",
    STUDENT_DELETE: "student:delete",
    STUDENT_LIST: "student:list",
    // Teacher Management
    TEACHER_CREATE: "teacher:create",
    TEACHER_READ: "teacher:read",
    TEACHER_UPDATE: "teacher:update",
    TEACHER_DELETE: "teacher:delete",
    TEACHER_LIST: "teacher:list",
    // Classroom Management
    CLASSROOM_CREATE: "classroom:create",
    CLASSROOM_READ: "classroom:read",
    CLASSROOM_UPDATE: "classroom:update",
    CLASSROOM_DELETE: "classroom:delete",
    CLASSROOM_LIST: "classroom:list",
    // Subject Management
    SUBJECT_CREATE: "subject:create",
    SUBJECT_READ: "subject:read",
    SUBJECT_UPDATE: "subject:update",
    SUBJECT_DELETE: "subject:delete",
    SUBJECT_LIST: "subject:list",
    // Attendance Management
    ATTENDANCE_CREATE: "attendance:create",
    ATTENDANCE_READ: "attendance:read",
    ATTENDANCE_UPDATE: "attendance:update",
    ATTENDANCE_LIST: "attendance:list",
    ATTENDANCE_READ_SELF: "attendance:read:self",
    // Marks Management
    MARKS_CREATE: "marks:create",
    MARKS_READ: "marks:read",
    MARKS_UPDATE: "marks:update",
    MARKS_DELETE: "marks:delete",
    MARKS_READ_SELF: "marks:read:self",
    // Results Management
    RESULT_READ: "result:read",
    RESULT_READ_SELF: "result:read:self",
    // Exam Management
    EXAM_CREATE: "exam:create",
    EXAM_READ: "exam:read",
    EXAM_UPDATE: "exam:update",
    EXAM_DELETE: "exam:delete",
    EXAM_LIST: "exam:list",
    // Fee Management
    FEE_CREATE: "fee:create",
    FEE_READ: "fee:read",
    FEE_UPDATE: "fee:update",
    FEE_DELETE: "fee:delete",
    FEE_READ_SELF: "fee:read:self",
    // Book Management
    BOOK_CREATE: "book:create",
    BOOK_READ: "book:read",
    BOOK_UPDATE: "book:update",
    BOOK_DELETE: "book:delete",
    BOOK_LIST: "book:list",
    BOOK_ISSUE: "book:issue",
    BOOK_RETURN: "book:return",
    // Audit Management
    AUDIT_READ: "audit:read",
    // Data Operations
    IMPORT_DATA: "data:import",
    EXPORT_DATA: "data:export",
    // Profile
    PROFILE_READ: "profile:read",
    PROFILE_READ_SELF: "profile:read:self",
    PROFILE_UPDATE: "profile:update",
};
//# sourceMappingURL=permissions.js.map