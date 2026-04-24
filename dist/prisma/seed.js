"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../src/config/prisma");
const permissions_1 = require("../src/constants/permissions");
const roles_1 = require("../src/constants/roles");
const password_1 = __importDefault(require("../src/utils/password"));
const DEFAULT_PASSWORD = "Password@123";
const SUPER_ADMIN_PASSWORD = "SuperAdmin@123";
const rolePermissions = {
    [roles_1.ROLES.SUPER_ADMIN]: Object.values(permissions_1.PERMISSIONS),
    [roles_1.ROLES.ADMIN]: [
        // User Management
        permissions_1.PERMISSIONS.USER_CREATE,
        permissions_1.PERMISSIONS.USER_READ,
        permissions_1.PERMISSIONS.USER_UPDATE,
        permissions_1.PERMISSIONS.USER_BLOCK,
        permissions_1.PERMISSIONS.USER_UNBLOCK,
        permissions_1.PERMISSIONS.USER_RESET_PASSWORD,
        permissions_1.PERMISSIONS.ADMIN_GRANT,
        permissions_1.PERMISSIONS.ADMIN_REVOKE,
        // Student Management
        permissions_1.PERMISSIONS.STUDENT_CREATE,
        permissions_1.PERMISSIONS.STUDENT_READ,
        permissions_1.PERMISSIONS.STUDENT_UPDATE,
        permissions_1.PERMISSIONS.STUDENT_LIST,
        // Teacher Management
        permissions_1.PERMISSIONS.TEACHER_CREATE,
        permissions_1.PERMISSIONS.TEACHER_READ,
        permissions_1.PERMISSIONS.TEACHER_UPDATE,
        permissions_1.PERMISSIONS.TEACHER_LIST,
        // Classroom Management
        permissions_1.PERMISSIONS.CLASSROOM_CREATE,
        permissions_1.PERMISSIONS.CLASSROOM_READ,
        permissions_1.PERMISSIONS.CLASSROOM_UPDATE,
        permissions_1.PERMISSIONS.CLASSROOM_LIST,
        // Subject Management
        permissions_1.PERMISSIONS.SUBJECT_CREATE,
        permissions_1.PERMISSIONS.SUBJECT_READ,
        permissions_1.PERMISSIONS.SUBJECT_UPDATE,
        permissions_1.PERMISSIONS.SUBJECT_LIST,
        // Attendance Management
        permissions_1.PERMISSIONS.ATTENDANCE_CREATE,
        permissions_1.PERMISSIONS.ATTENDANCE_READ,
        permissions_1.PERMISSIONS.ATTENDANCE_LIST,
        // Marks Management
        permissions_1.PERMISSIONS.MARKS_CREATE,
        permissions_1.PERMISSIONS.MARKS_READ,
        permissions_1.PERMISSIONS.MARKS_UPDATE,
        // Exam Management
        permissions_1.PERMISSIONS.EXAM_CREATE,
        permissions_1.PERMISSIONS.EXAM_READ,
        permissions_1.PERMISSIONS.EXAM_UPDATE,
        permissions_1.PERMISSIONS.EXAM_LIST,
        // Results
        permissions_1.PERMISSIONS.RESULT_READ,
        // Fee Management
        permissions_1.PERMISSIONS.FEE_CREATE,
        permissions_1.PERMISSIONS.FEE_READ,
        permissions_1.PERMISSIONS.FEE_UPDATE,
        // Book Management
        permissions_1.PERMISSIONS.BOOK_CREATE,
        permissions_1.PERMISSIONS.BOOK_READ,
        permissions_1.PERMISSIONS.BOOK_UPDATE,
        permissions_1.PERMISSIONS.BOOK_LIST,
        permissions_1.PERMISSIONS.BOOK_ISSUE,
        permissions_1.PERMISSIONS.BOOK_RETURN,
        // Audit & Data
        permissions_1.PERMISSIONS.AUDIT_READ,
        permissions_1.PERMISSIONS.IMPORT_DATA,
        permissions_1.PERMISSIONS.EXPORT_DATA,
        permissions_1.PERMISSIONS.PROFILE_READ_SELF,
    ],
    [roles_1.ROLES.STUDENT]: [
        permissions_1.PERMISSIONS.PROFILE_READ_SELF,
        permissions_1.PERMISSIONS.ATTENDANCE_READ_SELF,
        permissions_1.PERMISSIONS.MARKS_READ_SELF,
        permissions_1.PERMISSIONS.RESULT_READ_SELF,
        permissions_1.PERMISSIONS.FEE_READ_SELF,
        permissions_1.PERMISSIONS.BOOK_READ,
        permissions_1.PERMISSIONS.BOOK_ISSUE,
        permissions_1.PERMISSIONS.BOOK_RETURN,
    ],
    [roles_1.ROLES.TEACHER]: [
        permissions_1.PERMISSIONS.PROFILE_READ_SELF,
        permissions_1.PERMISSIONS.STUDENT_READ,
        permissions_1.PERMISSIONS.STUDENT_LIST,
        permissions_1.PERMISSIONS.CLASSROOM_READ,
        permissions_1.PERMISSIONS.CLASSROOM_LIST,
        permissions_1.PERMISSIONS.ATTENDANCE_CREATE,
        permissions_1.PERMISSIONS.ATTENDANCE_READ,
        permissions_1.PERMISSIONS.ATTENDANCE_LIST,
        permissions_1.PERMISSIONS.MARKS_CREATE,
        permissions_1.PERMISSIONS.MARKS_READ,
        permissions_1.PERMISSIONS.MARKS_UPDATE,
        permissions_1.PERMISSIONS.EXAM_READ,
        permissions_1.PERMISSIONS.EXAM_LIST,
        permissions_1.PERMISSIONS.RESULT_READ,
        permissions_1.PERMISSIONS.BOOK_READ,
    ],
    [roles_1.ROLES.ACCOUNTANT]: [
        permissions_1.PERMISSIONS.PROFILE_READ_SELF,
        permissions_1.PERMISSIONS.STUDENT_READ,
        permissions_1.PERMISSIONS.STUDENT_LIST,
        permissions_1.PERMISSIONS.FEE_CREATE,
        permissions_1.PERMISSIONS.FEE_READ,
        permissions_1.PERMISSIONS.FEE_UPDATE,
        permissions_1.PERMISSIONS.EXPORT_DATA,
    ],
    [roles_1.ROLES.LIBRARY_STAFF]: [
        permissions_1.PERMISSIONS.PROFILE_READ_SELF,
        permissions_1.PERMISSIONS.BOOK_CREATE,
        permissions_1.PERMISSIONS.BOOK_READ,
        permissions_1.PERMISSIONS.BOOK_UPDATE,
        permissions_1.PERMISSIONS.BOOK_LIST,
        permissions_1.PERMISSIONS.BOOK_ISSUE,
        permissions_1.PERMISSIONS.BOOK_RETURN,
    ],
};
const users = [
    {
        username: "superadmin",
        email: "superadmin@example.com",
        phone: "9000000001",
        password: SUPER_ADMIN_PASSWORD,
        role: roles_1.ROLES.SUPER_ADMIN,
    },
    {
        username: "admin",
        email: "admin@example.com",
        phone: "9000000002",
        password: DEFAULT_PASSWORD,
        role: roles_1.ROLES.ADMIN,
    },
    {
        username: "teacher1",
        email: "teacher1@example.com",
        phone: "9000000003",
        password: DEFAULT_PASSWORD,
        role: roles_1.ROLES.TEACHER,
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
        role: roles_1.ROLES.TEACHER,
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
        role: roles_1.ROLES.STUDENT,
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
        role: roles_1.ROLES.STUDENT,
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
        role: roles_1.ROLES.ACCOUNTANT,
    },
    {
        username: "library",
        email: "library@example.com",
        phone: "9000000008",
        password: DEFAULT_PASSWORD,
        role: roles_1.ROLES.LIBRARY_STAFF,
    },
];
const subjects = [
    { code: "MATH", name: "Mathematics" },
    { code: "SCI", name: "Science" },
    { code: "ENG", name: "English" },
];
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
];
const seedRolesAndPermissions = async () => {
    const permissionRecords = await Promise.all(Object.values(permissions_1.PERMISSIONS).map((code) => prisma_1.prisma.permission.upsert({
        where: { code },
        update: { name: code },
        create: {
            code,
            name: code,
        },
    })));
    for (const roleCode of Object.values(roles_1.ROLES)) {
        const role = await prisma_1.prisma.role.upsert({
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
            await prisma_1.prisma.rolePermission.upsert({
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
const assignRole = async (userId, roleCode) => {
    const role = await prisma_1.prisma.role.findUnique({
        where: { code: roleCode },
    });
    if (!role) {
        throw new Error(`Role not found: ${roleCode}`);
    }
    await prisma_1.prisma.userRole.upsert({
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
        const user = await prisma_1.prisma.user.upsert({
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
                passwordHash: await password_1.default.hashPassword(userData.password),
            },
        });
        await assignRole(user.id, userData.role);
        if ("teacherProfile" in userData) {
            await prisma_1.prisma.teacherProfile.upsert({
                where: { userId: user.id },
                update: userData.teacherProfile,
                create: {
                    userId: user.id,
                    ...userData.teacherProfile,
                },
            });
        }
        if ("studentProfile" in userData) {
            const classRoom = await prisma_1.prisma.classRoom.upsert({
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
            await prisma_1.prisma.studentProfile.upsert({
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
    const subjectRecords = await Promise.all(subjects.map((subject) => prisma_1.prisma.subject.upsert({
        where: { code: subject.code },
        update: { name: subject.name },
        create: subject,
    })));
    const exam = await prisma_1.prisma.exam.upsert({
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
    const studentProfiles = await prisma_1.prisma.studentProfile.findMany({
        include: { user: true },
        orderBy: { rollNumber: "asc" },
    });
    for (const [studentIndex, student] of studentProfiles.entries()) {
        for (const [subjectIndex, subject] of subjectRecords.entries()) {
            const marks = 72 + studentIndex * 5 + subjectIndex * 3;
            const attendanceDate = new Date(Date.UTC(2026, 3, 10 + studentIndex + subjectIndex));
            await prisma_1.prisma.attendanceRecord.upsert({
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
            await prisma_1.prisma.mark.upsert({
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
        await prisma_1.prisma.result.upsert({
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
    await Promise.all(books.map((book) => prisma_1.prisma.book.upsert({
        where: { isbn: book.isbn },
        update: book,
        create: book,
    })));
    const students = await prisma_1.prisma.user.findMany({
        where: {
            username: { in: ["student1", "student2"] },
        },
        orderBy: { username: "asc" },
    });
    for (const [index, student] of students.entries()) {
        const existingFee = await prisma_1.prisma.feeRecord.findFirst({
            where: {
                userId: student.id,
                description: "Seed tuition fee",
            },
        });
        if (existingFee) {
            await prisma_1.prisma.feeRecord.update({
                where: { id: existingFee.id },
                data: {
                    amount: 15000 + index * 1000,
                    dueDate: new Date("2026-05-15T00:00:00.000Z"),
                    status: index === 0 ? "PAID" : "PENDING",
                },
            });
            continue;
        }
        await prisma_1.prisma.feeRecord.create({
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
    await prisma_1.prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map