"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../src/config/prisma");
const permissions_1 = require("../src/constants/permissions");
const roles_1 = require("../src/constants/roles");
const password_1 = require("../src/utils/password");
const rolePermissions = {
    [roles_1.ROLES.SUPER_ADMIN]: Object.values(permissions_1.PERMISSIONS),
    [roles_1.ROLES.ADMIN]: [
        permissions_1.PERMISSIONS.USER_BLOCK,
        permissions_1.PERMISSIONS.USER_UNBLOCK,
        permissions_1.PERMISSIONS.PROFILE_READ_SELF,
        permissions_1.PERMISSIONS.ATTENDANCE_READ_SELF,
        permissions_1.PERMISSIONS.MARKS_READ_SELF,
        permissions_1.PERMISSIONS.RESULT_READ_SELF,
    ],
    [roles_1.ROLES.STUDENT]: [
        permissions_1.PERMISSIONS.PROFILE_READ_SELF,
        permissions_1.PERMISSIONS.ATTENDANCE_READ_SELF,
        permissions_1.PERMISSIONS.MARKS_READ_SELF,
        permissions_1.PERMISSIONS.RESULT_READ_SELF,
    ],
    [roles_1.ROLES.TEACHER]: [permissions_1.PERMISSIONS.PROFILE_READ_SELF],
    [roles_1.ROLES.ACCOUNTANT]: [permissions_1.PERMISSIONS.PROFILE_READ_SELF],
    [roles_1.ROLES.LIBRARY_STAFF]: [permissions_1.PERMISSIONS.PROFILE_READ_SELF],
};
const main = async () => {
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
            const permission = permissionRecords.find((p) => p.code === permissionCode);
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
    const superAdmin = await prisma_1.prisma.user.upsert({
        where: { username: "superadmin" },
        update: {
            email: "superadmin@example.com",
            isActive: true,
            isBlocked: false,
        },
        create: {
            username: "superadmin",
            email: "superadmin@example.com",
            passwordHash: await (0, password_1.hashPassword)("SuperAdmin@123"),
        },
    });
    const superAdminRole = await prisma_1.prisma.role.findUnique({
        where: { code: roles_1.ROLES.SUPER_ADMIN },
    });
    if (superAdminRole) {
        await prisma_1.prisma.userRole.upsert({
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
    await prisma_1.prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map