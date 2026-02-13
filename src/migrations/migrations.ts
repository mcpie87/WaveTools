import { Migration } from "./migrationTypes";

/* eslint-disable @typescript-eslint/no-require-imports */
export const migrations: Migration[] = [
  require("./migrations/2025-04-20T1823-delete-unused-localStorage").default,
  require("./migrations/2025-04-20T1852-rename-rover").default,
  require("./migrations/2025-04-25T2135-add-isactive-to-resonator-and-weapon").default,
  require("./migrations/2026-02-13T2250-add-schema-version").default,
].sort((a, b) => a.version.localeCompare(b.version));
/* eslint-enable @typescript-eslint/no-require-imports */