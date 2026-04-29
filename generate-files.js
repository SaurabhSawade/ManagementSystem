const fs = require("fs");
const path = require("path");

const root = process.cwd();

const directories = [
  "prisma",
  "src/config",
  "src/constants",
  "src/controller",
  "src/middleware",
  "src/model",
  "src/router/v1/resources/attendance",
  "src/router/v1/resources/audit",
  "src/router/v1/resources/auth",
  "src/router/v1/resources/book",
  "src/router/v1/resources/classroom",
  "src/router/v1/resources/exam",
  "src/router/v1/resources/fee",
  "src/router/v1/resources/import",
  "src/router/v1/resources/marks",
  "src/router/v1/resources/profile",
  "src/router/v1/resources/result",
  "src/router/v1/resources/student",
  "src/router/v1/resources/subject",
  "src/router/v1/resources/teacher",
  "src/router/v1/resources/user",
  "src/router/v1/roles/accountant",
  "src/router/v1/roles/admin",
  "src/router/v1/roles/library",
  "src/router/v1/roles/student",
  "src/router/v1/roles/teacher",
  "src/service",
  "src/types",
  "src/utils",
  "src/validation",
];

const files = [
  "prisma/schema.prisma",
  "prisma/seed.ts",
  "src/app.ts",
  "src/server.ts",
  "src/router/index.ts",
  "src/router/v1/index.ts",
  ".env.example",
  "package.json",
  "tsconfig.json",
];

for (const directory of directories) {
  fs.mkdirSync(path.join(root, directory), { recursive: true });
}

for (const file of files) {
  const filePath = path.join(root, file);

  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, "", "utf8");
  }
}

console.log("Project folders and missing starter files are ready.");
