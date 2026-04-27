import type { Prisma } from "../generated/prisma/client";
import { prisma } from "../config/prisma";

const classroomModel = {
  findByNameSection: (name: string, section: string) =>
    prisma.classRoom.findUnique({
      where: { name_section: { name, section } },
    }),

  create: (name: string, section: string) =>
    prisma.classRoom.create({
      data: { name, section },
    }),

  findById: (classroomId: string) =>
    prisma.classRoom.findUnique({
      where: { id: classroomId },
    }),

  findByIdWithStudents: (classroomId: string) =>
    prisma.classRoom.findUnique({
      where: { id: classroomId },
      include: {
        students: true,
        _count: {
          select: { students: true },
        },
      },
    }),

  updateById: (
    classroomId: string,
    data: { name?: string; section?: string },
  ) =>
    prisma.classRoom.update({
      where: { id: classroomId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.section && { section: data.section }),
      },
      include: { _count: { select: { students: true } } },
    }),

  findMany: (params: {
    where: Prisma.ClassRoomWhereInput;
    skip: number;
    take: number;
    sortBy: string;
    sortOrder: string;
  }) =>
    prisma.classRoom.findMany({
      where: params.where,
      skip: params.skip,
      take: params.take,
      orderBy: {
        [params.sortBy]: params.sortOrder as Prisma.SortOrder,
      },
      include: { _count: { select: { students: true } } },
    }),

  count: (where: Prisma.ClassRoomWhereInput) => prisma.classRoom.count({ where }),

  deleteById: (classroomId: string) =>
    prisma.classRoom.delete({
      where: { id: classroomId },
    }),
};

export default classroomModel;
