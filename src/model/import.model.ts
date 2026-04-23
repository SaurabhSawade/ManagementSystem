import crypto from "node:crypto";
import type { Prisma } from "../generated/prisma/client";
import { prisma } from "../config/prisma";

const importModel = {
  findRoleByCode: (code: string) =>
    prisma.role.findUnique({
      where: { code },
    }),

  upsertUser: (data: {
    username: string;
    email: string | null;
    phone: string | null;
    isActive: boolean;
    passwordHash: string;
  }) =>
    prisma.user.upsert({
      where: { username: data.username },
      update: {
        email: data.email,
        phone: data.phone,
        isActive: data.isActive,
      },
      create: {
        username: data.username,
        email: data.email,
        phone: data.phone,
        passwordHash: data.passwordHash,
      },
    }),

  findUserByUsername: (username: string) =>
    prisma.user.findUnique({
      where: { username },
    }),

  upsertClassRoom: (name: string, section: string) =>
    prisma.classRoom.upsert({
      where: {
        name_section: {
          name,
          section,
        },
      },
      update: {},
      create: {
        name,
        section,
      },
    }),

  upsertStudentProfile: (data: {
    userId: string;
    rollNumber: string;
    classRoomId: string;
    guardianName: string | null;
  }) =>
    prisma.studentProfile.upsert({
      where: { userId: data.userId },
      update: {
        rollNumber: data.rollNumber,
        classRoomId: data.classRoomId,
        guardianName: data.guardianName,
      },
      create: data,
    }),

  upsertTeacherProfile: (data: {
    userId: string;
    employeeId: string;
    department: string | null;
  }) =>
    prisma.teacherProfile.upsert({
      where: { userId: data.userId },
      update: {
        employeeId: data.employeeId,
        department: data.department,
      },
      create: data,
    }),

  upsertUserRole: (userId: string, roleId: string) =>
    prisma.userRole.upsert({
      where: {
        userId_roleId: { userId, roleId },
      },
      update: {},
      create: {
        userId,
        roleId,
      },
    }),

  findStudentProfileByUserId: (userId: string) =>
    prisma.studentProfile.findUnique({
      where: { userId },
    }),

  upsertSubject: (code: string, name: string) =>
    prisma.subject.upsert({
      where: { code },
      update: { name },
      create: {
        code,
        name,
      },
    }),

  resolveExam: async (row: Record<string, any>) => {
    const examId = row.examId ? String(row.examId) : undefined;
    const examDate = new Date(String(row.examDate ?? new Date().toISOString()));
    const examName = String(row.examName ?? "Exam");
    const term = String(row.term ?? "TERM");

    if (examId) {
      return prisma.exam.upsert({
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

    const existing = await prisma.exam.findFirst({
      where: {
        name: examName,
        term,
        examDate,
      },
    });

    if (existing) {
      return existing;
    }

    return prisma.exam.create({
      data: {
        id: crypto.randomUUID(),
        name: examName,
        term,
        examDate,
      },
    });
  },

  upsertAttendanceRecord: (data: {
    studentId: string;
    classRoomId: string;
    subjectId: string;
    date: Date;
    status: string;
  }) =>
    prisma.attendanceRecord.upsert({
      where: {
        studentId_subjectId_date: {
          studentId: data.studentId,
          subjectId: data.subjectId,
          date: data.date,
        },
      },
      update: {
        status: data.status,
        classRoomId: data.classRoomId,
      },
      create: data,
    }),

  upsertMark: (data: {
    studentId: string;
    classRoomId: string;
    subjectId: string;
    examId: string;
    marks: number;
    maxMarks: number;
  }) =>
    prisma.mark.upsert({
      where: {
        studentId_subjectId_examId: {
          studentId: data.studentId,
          subjectId: data.subjectId,
          examId: data.examId,
        },
      },
      update: {
        classRoomId: data.classRoomId,
        marks: data.marks,
        maxMarks: data.maxMarks,
      },
      create: data,
    }),

  upsertResult: (data: {
    studentId: string;
    classRoomId: string;
    examId: string;
    totalMarks: number;
    percentage: number;
    grade: string;
  }) =>
    prisma.result.upsert({
      where: {
        studentId_examId: {
          studentId: data.studentId,
          examId: data.examId,
        },
      },
      update: {
        classRoomId: data.classRoomId,
        totalMarks: data.totalMarks,
        percentage: data.percentage,
        grade: data.grade,
      },
      create: data,
    }),

  upsertBook: (data: {
    isbn: string;
    title: string;
    author: string;
    totalCopies: number;
    available: number;
  }) =>
    prisma.book.upsert({
      where: { isbn: data.isbn },
      update: {
        title: data.title,
        author: data.author,
        totalCopies: data.totalCopies,
        available: data.available,
      },
      create: data,
    }),

  createFeeRecord: (data: {
    userId: string;
    amount: number;
    dueDate: Date;
    status: string;
    description: string | null;
  }) =>
    prisma.feeRecord.create({
      data,
    }),

  createImportJob: (data: {
    actorId: string;
    fileName: string;
    totalRows: number;
    successRows: number;
    failedRows: number;
    errorSummary: Prisma.InputJsonValue;
  }) =>
    prisma.importJob.create({
      data,
    }),

  getExportData: async () => {
    const users = await prisma.user.findMany({
      select: {
        username: true,
        email: true,
        phone: true,
        isActive: true,
        isBlocked: true,
      },
    });

    const students = await prisma.studentProfile.findMany({
      include: { user: true, classRoom: true },
    });

    const teachers = await prisma.teacherProfile.findMany({
      include: { user: true },
    });

    const books = await prisma.book.findMany();
    const feeRecords = await prisma.feeRecord.findMany({ include: { user: true } });
    const attendance = await prisma.attendanceRecord.findMany({
      include: {
        student: { include: { user: true } },
        classRoom: true,
        subject: true,
      },
    });
    const marks = await prisma.mark.findMany({
      include: {
        student: { include: { user: true } },
        classRoom: true,
        subject: true,
        exam: true,
      },
    });
    const results = await prisma.result.findMany({
      include: {
        student: { include: { user: true } },
        classRoom: true,
        exam: true,
      },
    });

    return { users, students, teachers, books, feeRecords, attendance, marks, results };
  },
};

export default importModel;
