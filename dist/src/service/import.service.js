"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const XLSX = __importStar(require("xlsx"));
const appError_1 = require("../utils/appError");
const httpStatus_1 = require("../constants/httpStatus");
const password_1 = __importDefault(require("../utils/password"));
const roles_1 = require("../constants/roles");
const import_model_1 = __importDefault(require("../model/import.model"));
const readSheetRows = (workbook, sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) {
        return [];
    }
    return XLSX.utils.sheet_to_json(sheet, { defval: null });
};
const importExcelData = async (params) => {
    const workbook = XLSX.read(params.buffer, { type: "buffer" });
    const users = readSheetRows(workbook, "Users");
    const students = readSheetRows(workbook, "Students");
    const teachers = readSheetRows(workbook, "Teachers");
    const attendanceRows = readSheetRows(workbook, "Attendance");
    const markRows = readSheetRows(workbook, "Marks");
    const resultRows = readSheetRows(workbook, "Results");
    const books = readSheetRows(workbook, "Books");
    const fees = readSheetRows(workbook, "FeeRecords");
    const summary = {
        totalRows: users.length +
            students.length +
            teachers.length +
            attendanceRows.length +
            markRows.length +
            resultRows.length +
            books.length +
            fees.length,
        successRows: 0,
        failedRows: 0,
        errors: [],
    };
    const studentRole = await import_model_1.default.findRoleByCode(roles_1.ROLES.STUDENT);
    const teacherRole = await import_model_1.default.findRoleByCode(roles_1.ROLES.TEACHER);
    if (!studentRole || !teacherRole) {
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.BAD_REQUEST, "Default roles are missing", "VALIDATION_ERROR");
    }
    for (const [idx, row] of users.entries()) {
        try {
            await import_model_1.default.upsertUser({
                username: String(row.username),
                email: row.email ? String(row.email) : null,
                phone: row.phone ? String(row.phone) : null,
                isActive: row.isActive !== false,
                passwordHash: await password_1.default.hashPassword(String(row.password ?? "ChangeMe123")),
            });
            summary.successRows += 1;
        }
        catch (error) {
            summary.failedRows += 1;
            summary.errors.push({
                sheet: "Users",
                row: idx + 2,
                message: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    for (const [idx, row] of students.entries()) {
        try {
            const user = await import_model_1.default.findUserByUsername(String(row.username));
            if (!user) {
                throw new Error("Student user not found");
            }
            const classRoom = await import_model_1.default.upsertClassRoom(String(row.className), String(row.section));
            await import_model_1.default.upsertStudentProfile({
                userId: user.id,
                rollNumber: String(row.rollNumber),
                classRoomId: classRoom.id,
                guardianName: row.guardianName ? String(row.guardianName) : null,
            });
            await import_model_1.default.upsertUserRole(user.id, studentRole.id);
            summary.successRows += 1;
        }
        catch (error) {
            summary.failedRows += 1;
            summary.errors.push({
                sheet: "Students",
                row: idx + 2,
                message: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    for (const [idx, row] of teachers.entries()) {
        try {
            const user = await import_model_1.default.findUserByUsername(String(row.username));
            if (!user) {
                throw new Error("Teacher user not found");
            }
            await import_model_1.default.upsertTeacherProfile({
                userId: user.id,
                employeeId: String(row.employeeId),
                department: row.department ? String(row.department) : null,
            });
            await import_model_1.default.upsertUserRole(user.id, teacherRole.id);
            summary.successRows += 1;
        }
        catch (error) {
            summary.failedRows += 1;
            summary.errors.push({
                sheet: "Teachers",
                row: idx + 2,
                message: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    for (const [idx, row] of attendanceRows.entries()) {
        try {
            const user = await import_model_1.default.findUserByUsername(String(row.username));
            if (!user) {
                throw new Error("Student user not found");
            }
            const student = await import_model_1.default.findStudentProfileByUserId(user.id);
            if (!student) {
                throw new Error("Student profile not found");
            }
            const classRoom = await import_model_1.default.upsertClassRoom(String(row.className), String(row.section));
            const subject = await import_model_1.default.upsertSubject(String(row.subjectCode ?? row.subjectName), String(row.subjectName ?? row.subjectCode));
            await import_model_1.default.upsertAttendanceRecord({
                studentId: student.id,
                classRoomId: classRoom.id,
                subjectId: subject.id,
                date: new Date(String(row.date)),
                status: String(row.status ?? "PRESENT"),
            });
            summary.successRows += 1;
        }
        catch (error) {
            summary.failedRows += 1;
            summary.errors.push({
                sheet: "Attendance",
                row: idx + 2,
                message: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    for (const [idx, row] of markRows.entries()) {
        try {
            const user = await import_model_1.default.findUserByUsername(String(row.username));
            if (!user) {
                throw new Error("Student user not found");
            }
            const student = await import_model_1.default.findStudentProfileByUserId(user.id);
            if (!student) {
                throw new Error("Student profile not found");
            }
            const classRoom = await import_model_1.default.upsertClassRoom(String(row.className), String(row.section));
            const subject = await import_model_1.default.upsertSubject(String(row.subjectCode ?? row.subjectName), String(row.subjectName ?? row.subjectCode));
            const exam = await import_model_1.default.resolveExam(row);
            await import_model_1.default.upsertMark({
                studentId: student.id,
                classRoomId: classRoom.id,
                subjectId: subject.id,
                examId: exam.id,
                marks: Number(row.marks ?? 0),
                maxMarks: Number(row.maxMarks ?? 100),
            });
            summary.successRows += 1;
        }
        catch (error) {
            summary.failedRows += 1;
            summary.errors.push({
                sheet: "Marks",
                row: idx + 2,
                message: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    for (const [idx, row] of resultRows.entries()) {
        try {
            const user = await import_model_1.default.findUserByUsername(String(row.username));
            if (!user) {
                throw new Error("Student user not found");
            }
            const student = await import_model_1.default.findStudentProfileByUserId(user.id);
            if (!student) {
                throw new Error("Student profile not found");
            }
            const classRoom = await import_model_1.default.upsertClassRoom(String(row.className), String(row.section));
            const exam = await import_model_1.default.resolveExam(row);
            await import_model_1.default.upsertResult({
                studentId: student.id,
                classRoomId: classRoom.id,
                examId: exam.id,
                totalMarks: Number(row.totalMarks ?? 0),
                percentage: Number(row.percentage ?? 0),
                grade: String(row.grade ?? "NA"),
            });
            summary.successRows += 1;
        }
        catch (error) {
            summary.failedRows += 1;
            summary.errors.push({
                sheet: "Results",
                row: idx + 2,
                message: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    for (const [idx, row] of books.entries()) {
        try {
            await import_model_1.default.upsertBook({
                isbn: String(row.isbn),
                title: String(row.title),
                author: String(row.author),
                totalCopies: Number(row.totalCopies ?? 0),
                available: Number(row.available ?? row.totalCopies ?? 0),
            });
            summary.successRows += 1;
        }
        catch (error) {
            summary.failedRows += 1;
            summary.errors.push({
                sheet: "Books",
                row: idx + 2,
                message: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    for (const [idx, row] of fees.entries()) {
        try {
            const user = await import_model_1.default.findUserByUsername(String(row.username));
            if (!user) {
                throw new Error("User for fee record not found");
            }
            await import_model_1.default.createFeeRecord({
                userId: user.id,
                amount: Number(row.amount ?? 0),
                dueDate: new Date(String(row.dueDate)),
                status: String(row.status ?? "PENDING"),
                description: row.description ? String(row.description) : null,
            });
            summary.successRows += 1;
        }
        catch (error) {
            summary.failedRows += 1;
            summary.errors.push({
                sheet: "FeeRecords",
                row: idx + 2,
                message: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    await import_model_1.default.createImportJob({
        actorId: params.actorId,
        fileName: params.fileName,
        totalRows: summary.totalRows,
        successRows: summary.successRows,
        failedRows: summary.failedRows,
        errorSummary: summary.errors,
    });
    return summary;
};
const exportExcelData = async () => {
    const { users, students, teachers, books, feeRecords, attendance, marks, results } = await import_model_1.default.getExportData();
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(users), "Users");
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(students.map((s) => ({
        username: s.user.username,
        rollNumber: s.rollNumber,
        className: s.classRoom.name,
        section: s.classRoom.section,
        guardianName: s.guardianName,
    }))), "Students");
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(teachers.map((t) => ({
        username: t.user.username,
        employeeId: t.employeeId,
        department: t.department,
    }))), "Teachers");
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(books), "Books");
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(attendance.map((a) => ({
        username: a.student.user.username,
        className: a.classRoom.name,
        section: a.classRoom.section,
        subjectCode: a.subject.code,
        subjectName: a.subject.name,
        date: a.date,
        status: a.status,
    }))), "Attendance");
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(marks.map((m) => ({
        username: m.student.user.username,
        className: m.classRoom.name,
        section: m.classRoom.section,
        subjectCode: m.subject.code,
        subjectName: m.subject.name,
        examId: m.exam.id,
        examName: m.exam.name,
        term: m.exam.term,
        examDate: m.exam.examDate,
        marks: m.marks,
        maxMarks: m.maxMarks,
    }))), "Marks");
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(results.map((r) => ({
        username: r.student.user.username,
        className: r.classRoom.name,
        section: r.classRoom.section,
        examId: r.exam.id,
        examName: r.exam.name,
        term: r.exam.term,
        examDate: r.exam.examDate,
        totalMarks: r.totalMarks,
        percentage: r.percentage,
        grade: r.grade,
    }))), "Results");
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(feeRecords.map((f) => ({
        username: f.user.username,
        amount: f.amount,
        dueDate: f.dueDate,
        status: f.status,
        description: f.description,
    }))), "FeeRecords");
    return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
};
const importService = {
    importExcelData,
    exportExcelData,
};
exports.default = importService;
//# sourceMappingURL=import.service.js.map