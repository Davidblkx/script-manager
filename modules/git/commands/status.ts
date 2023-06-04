import { buildSpec, parseBranch, toResult } from '../utils.ts';

export type StatusParams = {
  short?: boolean;
  branch?: boolean;
  showStash?: boolean;
  porcelain?: boolean | string;
  long?: boolean;
  verbose?: boolean;
  aheadBehind?: boolean;
};

export type StatusResult =  {
  /** True, if folder contains untracked changes */
  dirty: boolean;
  /** Number of commits ahead of remote */
  ahead: number;
  /** Number of commits behind of remote */
  behind: number;
  /** Number of changes in the working tree */
  changes: number;
  /** Current branch name */
  branch: string;
  /** Remote branch */
  remote?: string;
};

export const status = buildSpec('status', {} as StatusParams, (result) => {
  if (result.stderr.length) return result;

  const res = toResult(result, {
    ahead: 0,
    behind: 0,
    branch: '',
    changes: 0,
    dirty: false,
  } as StatusResult);

  if (res.stderr.length) return res;

  const lines = res.stdout.split('\n');
  for (const line of lines) {
    if (line.startsWith('##')) {
      const data = parseBranch(line);
      res.data.branch = data.branch;
      res.data.ahead = data.ahead;
      res.data.behind = data.behind;
      res.data.remote = data.remote;
    } else if (line.length) {
      res.data.dirty = true;
      res.data.changes++;
    }
  }

  return res;
});
