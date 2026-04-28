import { prisma } from "./prisma";
import { ROLE_PERMISSIONS } from "../constants/rolePermissions";
import { ROLES } from "../constants/roles";

const syncRbac = async () => {
  const permissionCodes = Array.from(
    new Set(Object.values(ROLE_PERMISSIONS).flat()),
  );

  const permissions = await Promise.all(
    permissionCodes.map((code) =>
      prisma.permission.upsert({
        where: { code },
        update: { name: code },
        create: { code, name: code },
      }),
    ),
  );

  for (const roleCode of Object.values(ROLES)) {
    const role = await prisma.role.upsert({
      where: { code: roleCode },
      update: { name: roleCode },
      create: { code: roleCode, name: roleCode },
    });

    for (const permissionCode of ROLE_PERMISSIONS[roleCode] ?? []) {
      const permission = permissions.find((item) => item.code === permissionCode);
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

export default syncRbac;
