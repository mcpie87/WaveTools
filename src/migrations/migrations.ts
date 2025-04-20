import { Migration } from "./migrationTypes";

/* eslint-disable @typescript-eslint/no-require-imports */
export const migrations: Migration[] = [
  require("./migrations/2025-04-20T1823-delete-unused-localStorage").default,
  require("./migrations/2025-04-20T1852-rename-rover").default,
].sort((a, b) => a.version.localeCompare(b.version));
/* eslint-enable @typescript-eslint/no-require-imports */