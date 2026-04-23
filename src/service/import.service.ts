import * as XLSX from "xlsx";
import { AppError } from "../utils/appError";
import { HTTP_STATUS } from "../constants/httpStatus";
import passwordUtils from "../utils/password";
import { ROLES } from "../constants/roles";
import importModel from "../model/import.model";

type ImportSummary = {
  totalRows: number;
  successRows: number;
  failedRows: number;
  errors: Array<{ sheet: string; row: number; message: string }>;
};

const readSheetRows = (workbook: XLSX.WorkBook, sheetName: string): Record<string, any>[] => {
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) {
    return [];
  }
  return XLSX.utils.sheet_to_json<Record<string, any>>(sheet, { defval: null });
};

const importExcelData = async (params: {
  actorId: string;
  fileName: string;
  buffer: Buffer;
}) => {
  const workbook = XLSX.read(params.buffer, { type: "buffer" });

  const users = readSheetRows(workbook, "Users");
  const students = readSheetRows(workbook, "Students");
  const teachers = readSheetRows(workbook, "Teachers");
  const attendanceRows = readSheetRows(workbook, "Attendance");
  const markRows = readSheetRows(workbook, "Marks");
  const resultRows = readSheetRows(workbook, "Results");
  const books = readSheetRows(workbook, "Books");
  const fees = readSheetRows(workbook, "FeeRecords");

  const summary: ImportSummary = {
    totalRows:
      users.length +
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

  const studentRole = await importModel.findRoleByCode(ROLES.STUDENT);
  const teacherRole = await importModel.findRoleByCode(ROLES.TEACHER);

  if (!studentRole || !teacherRole) {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, "Default roles are missing", "VALIDATION_ERROR");
  }

  for (const [idx, row] of users.entries()) {
    try {
      await importModel.upsertUser({
        username: String(row.username),
        email: row.email ? String(row.email) : null,
        phone: row.phone ? String(row.phone) : null,
        isActive: row.isActive !== false,
        passwordHash: await passwordUtils.hashPassword(String(row.password ?? "ChangeMe123")),
      });
      summary.successRows += 1;
    } catch (error) {
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
      const user = await importModel.findUserByUsername(String(row.username));
      if (!user) {
        throw new Error("Student user not found");
      }

      const classRoom = await importModel.upsertClassRoom(
        String(row.className),
        String(row.section),
      );

      await importModel.upsertStudentProfile({
        userId: user.id,
        rollNumber: String(row.rollNumber),
        classRoomId: classRoom.id,
        guardianName: row.guardianName ? String(row.guardianName) : null,
      });

      await importModel.upsertUserRole(user.id, studentRole.id);

      summary.successRows += 1;
    } catch (error) {
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
      const user = await importModel.findUserByUsername(String(row.username));
      if (!user) {
        throw new Error("Teacher user not found");
      }

      await importModel.upsertTeacherProfile({
        userId: user.id,
        employeeId: String(row.employeeId),
        department: row.department ? String(row.department) : null,
      });

      await importModel.upsertUserRole(user.id, teacherRole.id);

      summary.successRows += 1;
    } catch (error) {
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
      const user = await importModel.findUserByUsername(String(row.username));
      if (!user) {
        throw new Error("Student user not found");
      }

      const student = await importModel.findStudentProfileByUserId(user.id);
      if (!student) {
        throw new Error("Student profile not found");
      }

      const classRoom = await importModel.upsertClassRoom(
        String(row.className),
        String(row.section),
      );

      const subject = await importModel.upsertSubject(
        String(row.subjectCode ?? row.subjectName),
        String(row.subjectName ?? row.subjectCode),
      );

      await importModel.upsertAttendanceRecord({
        studentId: student.id,
        classRoomId: classRoom.id,
        subjectId: subject.id,
        date: new Date(String(row.date)),
        status: String(row.status ?? "PRESENT"),
      });

      summary.successRows += 1;
    } catch (error) {
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
      const user = await importModel.findUserByUsername(String(row.username));
      if (!user) {
        throw new Error("Student user not found");
      }

      const student = await importModel.findStudentProfileByUserId(user.id);
      if (!student) {
        throw new Error("Student profile not found");
      }

      const classRoom = await importModel.upsertClassRoom(
        String(row.className),
        String(row.section),
      );

      const subject = await importModel.upsertSubject(
        String(row.subjectCode ?? row.subjectName),
        String(row.subjectName ?? row.subjectCode),
      );

      const exam = await importModel.resolveExam(row);

      await importModel.upsertMark({
        studentId: student.id,
        classRoomId: classRoom.id,
        subjectId: subject.id,
        examId: exam.id,
        marks: Number(row.marks ?? 0),
        maxMarks: Number(row.maxMarks ?? 100),
      });

      summary.successRows += 1;
    } catch (error) {
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
      const user = await importModel.findUserByUsername(String(row.username));
      if (!user) {
        throw new Error("Student user not found");
      }

      const student = await importModel.findStudentProfileByUserId(user.id);
      if (!student) {
        throw new Error("Student profile not found");
      }

      const classRoom = await importModel.upsertClassRoom(
        String(row.className),
        String(row.section),
      );

      const exam = await importModel.resolveExam(row);

      await importModel.upsertResult({
        studentId: student.id,
        classRoomId: classRoom.id,
        examId: exam.id,
        totalMarks: Number(row.totalMarks ?? 0),
        percentage: Number(row.percentage ?? 0),
        grade: String(row.grade ?? "NA"),
      });

      summary.successRows += 1;
    } catch (error) {
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
      await importModel.upsertBook({
        isbn: String(row.isbn),
        title: String(row.title),
        author: String(row.author),
        totalCopies: Number(row.totalCopies ?? 0),
        available: Number(row.available ?? row.totalCopies ?? 0),
      });
      summary.successRows += 1;
    } catch (error) {
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
      const user = await importModel.findUserByUsername(String(row.username));
      if (!user) {
        throw new Error("User for fee record not found");
      }

      await importModel.createFeeRecord({
        userId: user.id,
        amount: Number(row.amount ?? 0),
        dueDate: new Date(String(row.dueDate)),
        status: String(row.status ?? "PENDING"),
        description: row.description ? String(row.description) : null,
      });
      summary.successRows += 1;
    } catch (error) {
      summary.failedRows += 1;
      summary.errors.push({
        sheet: "FeeRecords",
        row: idx + 2,
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  await importModel.createImportJob({
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
  const { users, students, teachers, books, feeRecords, attendance, marks, results } =
    await importModel.getExportData();

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(users), "Users");
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet(
      students.map((s: any) => ({
        username: s.user.username,
        rollNumber: s.rollNumber,
        className: s.classRoom.name,
        section: s.classRoom.section,
        guardianName: s.guardianName,
      })),
    ),
    "Students",
  );
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet(
      teachers.map((t: any) => ({
        username: t.user.username,
        employeeId: t.employeeId,
        department: t.department,
      })),
    ),
    "Teachers",
  );
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(books), "Books");
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet(
      attendance.map((a: any) => ({
        username: a.student.user.username,
        className: a.classRoom.name,
        section: a.classRoom.section,
        subjectCode: a.subject.code,
        subjectName: a.subject.name,
        date: a.date,
        status: a.status,
      })),
    ),
    "Attendance",
  );
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet(
      marks.map((m: any) => ({
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
      })),
    ),
    "Marks",
  );
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet(
      results.map((r: any) => ({
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
      })),
    ),
    "Results",
  );
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet(
      feeRecords.map((f: any) => ({
        username: f.user.username,
        amount: f.amount,
        dueDate: f.dueDate,
        status: f.status,
        description: f.description,
      })),
    ),
    "FeeRecords",
  );

  return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }) as Buffer;
};

const importService = {
  importExcelData,
  exportExcelData,
};

export default importService;
