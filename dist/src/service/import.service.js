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
exports.exportExcelData = exports.importExcelData = void 0;
const XLSX = __importStar(require("xlsx"));
const node_crypto_1 = __importDefault(require("node:crypto"));
const prisma_1 = require("../config/prisma");
const appError_1 = require("../utils/appError");
const httpStatus_1 = require("../constants/httpStatus");
const password_1 = require("../utils/password");
const roles_1 = require("../constants/roles");
const readSheetRows = (workbook, sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) {
        return [];
    }
    return XLSX.utils.sheet_to_json(sheet, { defval: null });
};
const resolveExam = async (row) => {
    const examId = row.examId ? String(row.examId) : undefined;
    const examDate = new Date(String(row.examDate ?? new Date().toISOString()));
    const examName = String(row.examName ?? "Exam");
    const term = String(row.term ?? "TERM");
    if (examId) {
        return prisma_1.prisma.exam.upsert({
            where: { id: examId },
            update: {
                name: examName,
                term,
                examDate,
            },
            create: {
                id: examId,
                name: examName,
                term,
                examDate,
            },
        });
    }
    const existing = await prisma_1.prisma.exam.findFirst({
        where: {
            name: examName,
            term,
            examDate,
        },
    });
    if (existing) {
        return existing;
    }
    return prisma_1.prisma.exam.create({
        data: {
            id: node_crypto_1.default.randomUUID(),
            name: examName,
            term,
            examDate,
        },
    });
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
    const studentRole = await prisma_1.prisma.role.findUnique({ where: { code: roles_1.ROLES.STUDENT } });
    const teacherRole = await prisma_1.prisma.role.findUnique({ where: { code: roles_1.ROLES.TEACHER } });
    if (!studentRole || !teacherRole) {
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.BAD_REQUEST, "Default roles are missing", "VALIDATION_ERROR");
    }
    for (const [idx, row] of users.entries()) {
        try {
            await prisma_1.prisma.user.upsert({
                where: { username: String(row.username) },
                update: {
                    email: row.email ? String(row.email) : null,
                    phone: row.phone ? String(row.phone) : null,
                    isActive: row.isActive !== false,
                },
                create: {
                    username: String(row.username),
                    email: row.email ? String(row.email) : null,
                    phone: row.phone ? String(row.phone) : null,
                    passwordHash: await (0, password_1.hashPassword)(String(row.password ?? "ChangeMe123")),
                },
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
            const user = await prisma_1.prisma.user.findUnique({ where: { username: String(row.username) } });
            if (!user) {
                throw new Error("Student user not found");
            }
            const classRoom = await prisma_1.prisma.classRoom.upsert({
                where: {
                    name_section: {
                        name: String(row.className),
                        section: String(row.section),
                    },
                },
                update: {},
                create: {
                    name: String(row.className),
                    section: String(row.section),
                },
            });
            await prisma_1.prisma.studentProfile.upsert({
                where: { userId: user.id },
                update: {
                    rollNumber: String(row.rollNumber),
                    classRoomId: classRoom.id,
                    guardianName: row.guardianName ? String(row.guardianName) : null,
                },
                create: {
                    userId: user.id,
                    rollNumber: String(row.rollNumber),
                    classRoomId: classRoom.id,
                    guardianName: row.guardianName ? String(row.guardianName) : null,
                },
            });
            await prisma_1.prisma.userRole.upsert({
                where: {
                    userId_roleId: { userId: user.id, roleId: studentRole.id },
                },
                update: {},
                create: {
                    userId: user.id,
                    roleId: studentRole.id,
                },
            });
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
            const user = await prisma_1.prisma.user.findUnique({ where: { username: String(row.username) } });
            if (!user) {
                throw new Error("Teacher user not found");
            }
            await prisma_1.prisma.teacherProfile.upsert({
                where: { userId: user.id },
                update: {
                    employeeId: String(row.employeeId),
                    department: row.department ? String(row.department) : null,
                },
                create: {
                    userId: user.id,
                    employeeId: String(row.employeeId),
                    department: row.department ? String(row.department) : null,
                },
            });
            await prisma_1.prisma.userRole.upsert({
                where: {
                    userId_roleId: { userId: user.id, roleId: teacherRole.id },
                },
                update: {},
                create: {
                    userId: user.id,
                    roleId: teacherRole.id,
                },
            });
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
            const user = await prisma_1.prisma.user.findUnique({ where: { username: String(row.username) } });
            if (!user) {
                throw new Error("Student user not found");
            }
            const student = await prisma_1.prisma.studentProfile.findUnique({ where: { userId: user.id } });
            if (!student) {
                throw new Error("Student profile not found");
            }
            const classRoom = await prisma_1.prisma.classRoom.upsert({
                where: {
                    name_section: {
                        name: String(row.className),
                        section: String(row.section),
                    },
                },
                update: {},
                create: {
                    name: String(row.className),
                    section: String(row.section),
                },
            });
            const subject = await prisma_1.prisma.subject.upsert({
                where: { code: String(row.subjectCode ?? row.subjectName) },
                update: { name: String(row.subjectName ?? row.subjectCode) },
                create: {
                    code: String(row.subjectCode ?? row.subjectName),
                    name: String(row.subjectName ?? row.subjectCode),
                },
            });
            await prisma_1.prisma.attendanceRecord.upsert({
                where: {
                    studentId_subjectId_date: {
                        studentId: student.id,
                        subjectId: subject.id,
                        date: new Date(String(row.date)),
                    },
                },
                update: {
                    status: String(row.status ?? "PRESENT"),
                    classRoomId: classRoom.id,
                },
                create: {
                    studentId: student.id,
                    classRoomId: classRoom.id,
                    subjectId: subject.id,
                    date: new Date(String(row.date)),
                    status: String(row.status ?? "PRESENT"),
                },
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
            const user = await prisma_1.prisma.user.findUnique({ where: { username: String(row.username) } });
            if (!user) {
                throw new Error("Student user not found");
            }
            const student = await prisma_1.prisma.studentProfile.findUnique({ where: { userId: user.id } });
            if (!student) {
                throw new Error("Student profile not found");
            }
            const classRoom = await prisma_1.prisma.classRoom.upsert({
                where: {
                    name_section: {
                        name: String(row.className),
                        section: String(row.section),
                    },
                },
                update: {},
                create: {
                    name: String(row.className),
                    section: String(row.section),
                },
            });
            const subject = await prisma_1.prisma.subject.upsert({
                where: { code: String(row.subjectCode ?? row.subjectName) },
                update: { name: String(row.subjectName ?? row.subjectCode) },
                create: {
                    code: String(row.subjectCode ?? row.subjectName),
                    name: String(row.subjectName ?? row.subjectCode),
                },
            });
            const exam = await resolveExam(row);
            await prisma_1.prisma.mark.upsert({
                where: {
                    studentId_subjectId_examId: {
                        studentId: student.id,
                        subjectId: subject.id,
                        examId: exam.id,
                    },
                },
                update: {
                    classRoomId: classRoom.id,
                    marks: Number(row.marks ?? 0),
                    maxMarks: Number(row.maxMarks ?? 100),
                },
                create: {
                    studentId: student.id,
                    classRoomId: classRoom.id,
                    subjectId: subject.id,
                    examId: exam.id,
                    marks: Number(row.marks ?? 0),
                    maxMarks: Number(row.maxMarks ?? 100),
                },
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
            const user = await prisma_1.prisma.user.findUnique({ where: { username: String(row.username) } });
            if (!user) {
                throw new Error("Student user not found");
            }
            const student = await prisma_1.prisma.studentProfile.findUnique({ where: { userId: user.id } });
            if (!student) {
                throw new Error("Student profile not found");
            }
            const classRoom = await prisma_1.prisma.classRoom.upsert({
                where: {
                    name_section: {
                        name: String(row.className),
                        section: String(row.section),
                    },
                },
                update: {},
                create: {
                    name: String(row.className),
                    section: String(row.section),
                },
            });
            const exam = await resolveExam(row);
            await prisma_1.prisma.result.upsert({
                where: {
                    studentId_examId: {
                        studentId: student.id,
                        examId: exam.id,
                    },
                },
                update: {
                    classRoomId: classRoom.id,
                    totalMarks: Number(row.totalMarks ?? 0),
                    percentage: Number(row.percentage ?? 0),
                    grade: String(row.grade ?? "NA"),
                },
                create: {
                    studentId: student.id,
                    classRoomId: classRoom.id,
                    examId: exam.id,
                    totalMarks: Number(row.totalMarks ?? 0),
                    percentage: Number(row.percentage ?? 0),
                    grade: String(row.grade ?? "NA"),
                },
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
            await prisma_1.prisma.book.upsert({
                where: { isbn: String(row.isbn) },
                update: {
                    title: String(row.title),
                    author: String(row.author),
                    totalCopies: Number(row.totalCopies ?? 0),
                    available: Number(row.available ?? row.totalCopies ?? 0),
                },
                create: {
                    isbn: String(row.isbn),
                    title: String(row.title),
                    author: String(row.author),
                    totalCopies: Number(row.totalCopies ?? 0),
                    available: Number(row.available ?? row.totalCopies ?? 0),
                },
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
            const user = await prisma_1.prisma.user.findUnique({ where: { username: String(row.username) } });
            if (!user) {
                throw new Error("User for fee record not found");
            }
            await prisma_1.prisma.feeRecord.create({
                data: {
                    userId: user.id,
                    amount: Number(row.amount ?? 0),
                    dueDate: new Date(String(row.dueDate)),
                    status: String(row.status ?? "PENDING"),
                    description: row.description ? String(row.description) : null,
                },
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
    await prisma_1.prisma.importJob.create({
        data: {
            actorId: params.actorId,
            fileName: params.fileName,
            totalRows: summary.totalRows,
            successRows: summary.successRows,
            failedRows: summary.failedRows,
            errorSummary: summary.errors,
        },
    });
    return summary;
};
exports.importExcelData = importExcelData;
const exportExcelData = async () => {
    const users = await prisma_1.prisma.user.findMany({
        select: {
            username: true,
            email: true,
            phone: true,
            isActive: true,
            isBlocked: true,
        },
    });
    const students = await prisma_1.prisma.studentProfile.findMany({
        include: { user: true, classRoom: true },
    });
    const teachers = await prisma_1.prisma.teacherProfile.findMany({
        include: { user: true },
    });
    const books = await prisma_1.prisma.book.findMany();
    const feeRecords = await prisma_1.prisma.feeRecord.findMany({ include: { user: true } });
    const attendance = await prisma_1.prisma.attendanceRecord.findMany({
        include: {
            student: { include: { user: true } },
            classRoom: true,
            subject: true,
        },
    });
    const marks = await prisma_1.prisma.mark.findMany({
        include: {
            student: { include: { user: true } },
            classRoom: true,
            subject: true,
            exam: true,
        },
    });
    const results = await prisma_1.prisma.result.findMany({
        include: {
            student: { include: { user: true } },
            classRoom: true,
            exam: true,
        },
    });
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
exports.exportExcelData = exportExcelData;
//# sourceMappingURL=import.service.js.map