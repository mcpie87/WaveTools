export type VERSION = `${number}-${number}-${number}T${number}-${number}`; // ISO date string (YYYY-MM-DDThh-mm)

const versionRegex = /^\d{4}-\d{2}-\d{2}T\d{2}-\d{2}$/;
export function validateVersion(version: VERSION): VERSION {
  if (!versionRegex.test(version)) {
    throw new Error(
      `Invalid version format: ${version}. Must be YYYY-MM-DDThh-mm (e.g., 2023-01-15T14-30)`
    );
  }
  return version;
}


export interface Migration {
  version: VERSION;
  description: string;
  up: () => Promise<void>;
}

