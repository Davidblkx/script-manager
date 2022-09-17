export interface GitStatus {
  branch: string;
  remote: string;
  status: 'synced' | 'behind' | 'ahead' | 'diverged';
  value: number;
}

export function parseGitStatus(stdout: string): GitStatus {
  const REGEX_STATUS = /(?:^\#\#\s(.+)\.{3}(.+?)\s\[(\w+)\s(\d+)\]|(?:^\#\#\s(.+)\.{3}(.+?)$|^\#\#\s(.+)))/gm

  const matches = stdout.matchAll(REGEX_STATUS);
  const m = matches.next().value as (string[] | undefined);

  if (m === undefined) {
    throw new Error('Unable to parse git status');
  }

  return {
    branch: m[1] ?? m[5] ?? m[7],
    remote: m[2] ?? m[6] ?? '',
    status: m[3] as 'synced' ?? 'synced',
    value: Number(m[4] ?? '0'),
  };
}
