import { prisma } from "./prisma";
import { ROLE_PERMISSIONS } from "../constants/rolePermissions";
import { ROLES } from "../constants/roles";

const syncRbac = async () => {
  const permissionCodes = Array.from(
    new Set(Object.values(ROLE_PERMISSIONS).flat()),
  );

  await prisma.$transaction(async (tx) => {
    await tx.permission.createMany({
      data: permissionCodes.map((code) => ({ code, name: code })),
      skipDuplicates: true,
    });

    await tx.role.createMany({
      data: Object.values(ROLES).map((code) => ({ code, name: code })),
      skipDuplicates: true,
    });

    const [permissions, roles] = await Promise.all([
      tx.permission.findMany({
        where: { code: { in: permissionCodes } },
        select: { id: true, code: true },
      }),
      tx.role.findMany({
        where: { code: { in: Object.values(ROLES) } },
        select: { id: true, code: true },
      }),
    ]);

    const permissionIdByCode = new Map(
      permissions.map((permission) => [permission.code, permission.id]),
    );
    const roleIdByCode = new Map(roles.map((role) => [role.code, role.id]));

    await tx.rolePermission.createMany({
      data: Object.entries(ROLE_PERMISSIONS).flatMap(([roleCode, permissionCodesForRole]) => {
        const roleId = roleIdByCode.get(roleCode);
        if (!roleId) {
          return [];
        }

        return permissionCodesForRole.flatMap((permissionCode) => {
          const permissionId = permissionIdByCode.get(permissionCode);
          return permissionId ? [{ roleId, permissionId }] : [];
        });
      }),
      skipDuplicates: true,
    });
  });
};

export default syncRbac;
