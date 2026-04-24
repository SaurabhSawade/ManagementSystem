"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./v1/auth.routes"));
const user_routes_1 = __importDefault(require("./v1/user.routes"));
const profile_routes_1 = __importDefault(require("./v1/profile.routes"));
const import_routes_1 = __importDefault(require("./v1/import.routes"));
const student_routes_1 = __importDefault(require("./v1/student.routes"));
const teacher_routes_1 = __importDefault(require("./v1/teacher.routes"));
const classroom_routes_1 = __importDefault(require("./v1/classroom.routes"));
const subject_routes_1 = __importDefault(require("./v1/subject.routes"));
const attendance_routes_1 = __importDefault(require("./v1/attendance.routes"));
const marks_routes_1 = __importDefault(require("./v1/marks.routes"));
const exam_routes_1 = __importDefault(require("./v1/exam.routes"));
const result_routes_1 = __importDefault(require("./v1/result.routes"));
const fee_routes_1 = __importDefault(require("./v1/fee.routes"));
const book_routes_1 = __importDefault(require("./v1/book.routes"));
const audit_routes_1 = __importDefault(require("./v1/audit.routes"));
const apiRouter = (0, express_1.Router)();
// Authentication & User Management
apiRouter.use("/auth", auth_routes_1.default);
apiRouter.use("/users", user_routes_1.default);
apiRouter.use("/profile", profile_routes_1.default);
// Academic Management
apiRouter.use("/students", student_routes_1.default);
apiRouter.use("/teachers", teacher_routes_1.default);
apiRouter.use("/classrooms", classroom_routes_1.default);
apiRouter.use("/subjects", subject_routes_1.default);
apiRouter.use("/attendance", attendance_routes_1.default);
apiRouter.use("/marks", marks_routes_1.default);
apiRouter.use("/exams", exam_routes_1.default);
apiRouter.use("/results", result_routes_1.default);
// Administrative
apiRouter.use("/fees", fee_routes_1.default);
apiRouter.use("/books", book_routes_1.default);
apiRouter.use("/audit", audit_routes_1.default);
// Data Operations
apiRouter.use("/files", import_routes_1.default);
exports.default = apiRouter;
//# sourceMappingURL=index.js.map