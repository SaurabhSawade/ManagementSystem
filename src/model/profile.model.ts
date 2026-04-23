import { prisma } from "../config/prisma";

const profileModel = {
  findProfileByUserId: (userId: string) =>
    prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: {
          include: {
            classRoom: true,
            attendance: {
              include: { subject: true },
              orderBy: { date: "desc" },
              take: 30,
            },
            marks: {
              include: { exam: true, subject: true },
              orderBy: { createdAt: "desc" },
              take: 50,
            },
            results: {
              include: { exam: true },
              orderBy: { createdAt: "desc" },
              take: 20,
            },
          },
        },
        teacherProfile: true,
        roles: {
          include: {
            role: true,
          },
        },
      },
    }),
};

export default profileModel;
