export type SemVersion = {
  major: number;
  minor: number;
  patch: number;
  value: string;
};

export interface ISemVersion {
  major: number;
  minor: number;
  patch: number;
  value: string;

  before(other: SemVersion): boolean;
  after(other: SemVersion): boolean;
  equal(other: SemVersion): boolean;
}

export function parseSemVersion(version: string): ISemVersion {
  const [major, minor, patch] = version.split('.').map(Number);

  if (Number.isNaN(major) || Number.isNaN(minor) || Number.isNaN(patch)) {
    throw new Error(`Invalid version: ${version}`);
  }

  return {
    major,
    minor,
    patch,
    value: version,

    before(other: SemVersion): boolean {
      return compareSemVersion(this, other) < 0;
    },

    after(other: SemVersion): boolean {
      return compareSemVersion(this, other) > 0;
    },

    equal(other: SemVersion): boolean {
      return compareSemVersion(this, other) === 0;
    },
  };
}

export function compareSemVersion(a: SemVersion, b: SemVersion): number {
  if (a.major !== b.major) {
    return a.major - b.major;
  }

  if (a.minor !== b.minor) {
    return a.minor - b.minor;
  }

  if (a.patch !== b.patch) {
    return a.patch - b.patch;
  }

  return 0;
}
