import { prisma } from "../src/config/prisma";
import { PERMISSIONS } from "../src/constants/permissions";
import { ROLES } from "../src/constants/roles";
import { hashPassword } from "../src/utils/password";

const rolePermissions: Record<string, string[]> = {
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),
  [ROLES.ADMIN]: [
    PERMISSIONS.USER_BLOCK,
    PERMISSIONS.USER_UNBLOCK,
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
  [ROLES.TEACHER]: [PERMISSIONS.PROFILE_READ_SELF],
  [ROLES.ACCOUNTANT]: [PERMISSIONS.PROFILE_READ_SELF],
  [ROLES.LIBRARY_STAFF]: [PERMISSIONS.PROFILE_READ_SELF],
};

const main = async () => {
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
      const permission = permissionRecords.find((p) => p.code === permissionCode);
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

  const superAdmin = await prisma.user.upsert({
    where: { username: "superadmin" },
    update: {
      email: "superadmin@example.com",
      isActive: true,
      isBlocked: false,
    },
    create: {
      username: "superadmin",
      email: "superadmin@example.com",
      passwordHash: await hashPassword("SuperAdmin@123"),
    },
  });

  const superAdminRole = await prisma.role.findUnique({
    where: { code: ROLES.SUPER_ADMIN },
  });

  if (superAdminRole) {
    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: superAdmin.id,
          roleId: superAdminRole.id,
        },
      },
      update: {},
      create: {
        userId: superAdmin.id,
        roleId: superAdminRole.id,
      },
    });
  }

  console.log("Seed completed. Super admin username: superadmin, password: SuperAdmin@123");
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
