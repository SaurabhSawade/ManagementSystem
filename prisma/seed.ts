import { prisma } from "../src/config/prisma";
import { PERMISSIONS } from "../src/constants/permissions";
import { ROLES } from "../src/constants/roles";
import passwordUtils from "../src/utils/password";

const DEFAULT_PASSWORD = "Password@123";
const SUPER_ADMIN_PASSWORD = "SuperAdmin@123";

const rolePermissions: Record<string, string[]> = {
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),
  [ROLES.ADMIN]: [
    PERMISSIONS.USER_CREATE,
    PERMISSIONS.USER_BLOCK,
    PERMISSIONS.USER_UNBLOCK,
    PERMISSIONS.USER_RESET_PASSWORD,
    PERMISSIONS.ADMIN_GRANT,
    PERMISSIONS.ADMIN_REVOKE,
    PERMISSIONS.IMPORT_DATA,
    PERMISSIONS.EXPORT_DATA,
    PERMISSIONS.PROFILE_READ_SELF,
    PERMISSIONS.ATTENDANCE_READ_SELF,
    PERMISSIONS.MARKS_READ_SELF,
    PERMISSIONS.RESULT_READ_SELF,
  ],
  [ROLES.STUDENT]: [
    PERMISSIONS.PROFILE_READ_SELF,
    PERMISSIONS.ATTENDANCE_READ_SELF,
    PERMISSIONS.MARKS_READ_SELF,
    PERMISSIONS.RESULT_READ_SELF,
  ],
  [ROLES.TEACHER]: [
    PERMISSIONS.PROFILE_READ_SELF,
    PERMISSIONS.ATTENDANCE_READ_SELF,
    PERMISSIONS.MARKS_READ_SELF,
    PERMISSIONS.RESULT_READ_SELF,
  ],
  [ROLES.ACCOUNTANT]: [
    PERMISSIONS.PROFILE_READ_SELF,
    PERMISSIONS.EXPORT_DATA,
  ],
  [ROLES.LIBRARY_STAFF]: [PERMISSIONS.PROFILE_READ_SELF],
};

const users = [
  {
    username: "superadmin",
    email: "superadmin@example.com",
    phone: "9000000001",
    password: SUPER_ADMIN_PASSWORD,
    role: ROLES.SUPER_ADMIN,
  },
  {
    username: "admin",
    email: "admin@example.com",
    phone: "9000000002",
    password: DEFAULT_PASSWORD,
    role: ROLES.ADMIN,
  },
  {
    username: "teacher1",
    email: "teacher1@example.com",
    phone: "9000000003",
    password: DEFAULT_PASSWORD,
    role: ROLES.TEACHER,
    teacherProfile: {
      employeeId: "EMP-T-001",
      department: "Science",
    },
  },
  {
    username: "teacher2",
    email: "teacher2@example.com",
    phone: "9000000004",
    password: DEFAULT_PASSWORD,
    role: ROLES.TEACHER,
    teacherProfile: {
      employeeId: "EMP-T-002",
      department: "Mathematics",
    },
  },
  {
    username: "student1",
    email: "student1@example.com",
    phone: "9000000005",
    password: DEFAULT_PASSWORD,
    role: ROLES.STUDENT,
    studentProfile: {
      rollNumber: "ROLL-001",
      className: "10",
      section: "A",
      guardianName: "Ramesh Sharma",
    },
  },
  {
    username: "student2",
    email: "student2@example.com",
    phone: "9000000006",
    password: DEFAULT_PASSWORD,
    role: ROLES.STUDENT,
    studentProfile: {
      rollNumber: "ROLL-002",
      className: "10",
      section: "A",
      guardianName: "Sunita Verma",
    },
  },
  {
    username: "accountant",
    email: "accountant@example.com",
    phone: "9000000007",
    password: DEFAULT_PASSWORD,
    role: ROLES.ACCOUNTANT,
  },
  {
    username: "library",
    email: "library@example.com",
    phone: "9000000008",
    password: DEFAULT_PASSWORD,
    role: ROLES.LIBRARY_STAFF,
  },
] as const;

const subjects = [
  { code: "MATH", name: "Mathematics" },
  { code: "SCI", name: "Science" },
  { code: "ENG", name: "English" },
] as const;

const books = [
  {
    isbn: "9780000000001",
    title: "Introduction to Mathematics",
    author: "Academic Press",
    totalCopies: 10,
    available: 10,
  },
  {
    isbn: "9780000000002",
    title: "Foundations of Science",
    author: "Learning House",
    totalCopies: 8,
    available: 8,
  },
] as const;

const seedRolesAndPermissions = async () => {
  const permissionRecords = await Promise.all(
    Object.values(PERMISSIONS).map((code) =>
      prisma.permission.upsert({
        where: { code },
        update: { name: code },
        create: {
          code,
          name: code,
        },
      }),
    ),
  );

  for (const roleCode of Object.values(ROLES)) {
    const role = await prisma.role.upsert({
      where: { code: roleCode },
      update: { name: roleCode },
      create: {
        code: roleCode,
        name: roleCode,
      },
    });

    for (const permissionCode of rolePermissions[roleCode] ?? []) {
      const permission = permissionRecords.find((item) => item.code === permissionCode);
      if (!permission) {
        continue;
      }

      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: role.id,
          permissionId: permission.id,
        },
      });
    }
  }
};

const assignRole = async (userId: string, roleCode: string) => {
  const role = await prisma.role.findUnique({
    where: { code: roleCode },
  });

  if (!role) {
    throw new Error(`Role not found: ${roleCode}`);
  }

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId,
        roleId: role.id,
      },
    },
    update: {},
    create: {
      userId,
      roleId: role.id,
    },
  });
};

const seedUsers = async () => {
  for (const userData of users) {
    const user = await prisma.user.upsert({
      where: { username: userData.username },
      update: {
        email: userData.email,
        phone: userData.phone,
        isActive: true,
        isBlocked: false,
        blockedReason: null,
        blockedAt: null,
      },
      create: {
        username: userData.username,
        email: userData.email,
        phone: userData.phone,
        passwordHash: await passwordUtils.hashPassword(userData.password),
      },
    });

    await assignRole(user.id, userData.role);

    if ("teacherProfile" in userData) {
      await prisma.teacherProfile.upsert({
        where: { userId: user.id },
        update: userData.teacherProfile,
        create: {
          userId: user.id,
          ...userData.teacherProfile,
        },
      });
    }

    if ("studentProfile" in userData) {
      const classRoom = await prisma.classRoom.upsert({
        where: {
          name_section: {
            name: userData.studentProfile.className,
            section: userData.studentProfile.section,
          },
        },
        update: {},
        create: {
          name: userData.studentProfile.className,
          section: userData.studentProfile.section,
        },
      });

      await prisma.studentProfile.upsert({
        where: { userId: user.id },
        update: {
          rollNumber: userData.studentProfile.rollNumber,
          classRoomId: classRoom.id,
          guardianName: userData.studentProfile.guardianName,
        },
        create: {
          userId: user.id,
          rollNumber: userData.studentProfile.rollNumber,
          classRoomId: classRoom.id,
          guardianName: userData.studentProfile.guardianName,
        },
      });
    }
  }
};

const seedAcademicData = async () => {
  const subjectRecords = await Promise.all(
    subjects.map((subject) =>
      prisma.subject.upsert({
        where: { code: subject.code },
        update: { name: subject.name },
        create: subject,
      }),
    ),
  );

  const exam = await prisma.exam.upsert({
    where: { id: "seed-midterm-2026" },
    update: {
      name: "Mid Term Exam",
      term: "TERM_1",
      examDate: new Date("2026-04-01T00:00:00.000Z"),
    },
    create: {
      id: "seed-midterm-2026",
      name: "Mid Term Exam",
      term: "TERM_1",
      examDate: new Date("2026-04-01T00:00:00.000Z"),
    },
  });

  const studentProfiles = await prisma.studentProfile.findMany({
    include: { user: true },
    orderBy: { rollNumber: "asc" },
  });

  for (const [studentIndex, student] of studentProfiles.entries()) {
    for (const [subjectIndex, subject] of subjectRecords.entries()) {
      const marks = 72 + studentIndex * 5 + subjectIndex * 3;
      const attendanceDate = new Date(
        Date.UTC(2026, 3, 10 + studentIndex + subjectIndex),
      );

      await prisma.attendanceRecord.upsert({
        where: {
          studentId_subjectId_date: {
            studentId: student.id,
            subjectId: subject.id,
            date: attendanceDate,
          },
        },
        update: {
          classRoomId: student.classRoomId,
          status: "PRESENT",
        },
        create: {
          studentId: student.id,
          classRoomId: student.classRoomId,
          subjectId: subject.id,
          date: attendanceDate,
          status: "PRESENT",
        },
      });

      await prisma.mark.upsert({
        where: {
          studentId_subjectId_examId: {
            studentId: student.id,
            subjectId: subject.id,
            examId: exam.id,
          },
        },
        update: {
          classRoomId: student.classRoomId,
          marks,
          maxMarks: 100,
        },
        create: {
          studentId: student.id,
          classRoomId: student.classRoomId,
          subjectId: subject.id,
          examId: exam.id,
          marks,
          maxMarks: 100,
        },
      });
    }

    const totalMarks = 225 + studentIndex * 12;
    const percentage = Number(((totalMarks / 300) * 100).toFixed(2));

    await prisma.result.upsert({
      where: {
        studentId_examId: {
          studentId: student.id,
          examId: exam.id,
        },
      },
      update: {
        classRoomId: student.classRoomId,
        totalMarks,
        percentage,
        grade: percentage >= 80 ? "A" : "B",
      },
      create: {
        studentId: student.id,
        classRoomId: student.classRoomId,
        examId: exam.id,
        totalMarks,
        percentage,
        grade: percentage >= 80 ? "A" : "B",
      },
    });
  }
};

const seedLibraryAndFees = async () => {
  await Promise.all(
    books.map((book) =>
      prisma.book.upsert({
        where: { isbn: book.isbn },
        update: book,
        create: book,
      }),
    ),
  );

  const students = await prisma.user.findMany({
    where: {
      username: { in: ["student1", "student2"] },
    },
    orderBy: { username: "asc" },
  });

  for (const [index, student] of students.entries()) {
    const existingFee = await prisma.feeRecord.findFirst({
      where: {
        userId: student.id,
        description: "Seed tuition fee",
      },
    });

    if (existingFee) {
      await prisma.feeRecord.update({
        where: { id: existingFee.id },
        data: {
          amount: 15000 + index * 1000,
          dueDate: new Date("2026-05-15T00:00:00.000Z"),
          status: index === 0 ? "PAID" : "PENDING",
        },
      });
      continue;
    }

    await prisma.feeRecord.create({
      data: {
        userId: student.id,
        amount: 15000 + index * 1000,
        dueDate: new Date("2026-05-15T00:00:00.000Z"),
        status: index === 0 ? "PAID" : "PENDING",
        description: "Seed tuition fee",
      },
    });
  }
};

const main = async () => {
  await seedRolesAndPermissions();
  await seedUsers();
  await seedAcademicData();
  await seedLibraryAndFees();

  console.log("Seed completed successfully.");
  console.log(`Super admin login: superadmin / ${SUPER_ADMIN_PASSWORD}`);
  console.log(`Other sample users password: ${DEFAULT_PASSWORD}`);
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
