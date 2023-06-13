import { parseBranch } from '../utils.ts';
import { buildCommandSpec } from '../../aif/mod.ts';

export type StatusParams = {
  short?: boolean;
  branch?: boolean;
  showStash?: boolean;
  porcelain?: boolean | string;
  long?: boolean;
  verbose?: boolean;
  aheadBehind?: boolean;
};

export type StatusResult = {
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

export const status = buildCommandSpec('status', {} as StatusParams, (result) => {
  if (result.stderr?.length) return result;

  const data: StatusResult = {
    ahead: 0,
    behind: 0,
    branch: '',
    changes: 0,
    dirty: false,
  };

  if (!result.stdout) return data;

  const lines = result.stdout.split('\n');
  for (const line of lines) {
    if (line.startsWith('##')) {
      const bData = parseBranch(line);
      data.branch = bData.branch;
      data.ahead = bData.ahead;
      data.behind = bData.behind;
      data.remote = bData.remote;
    } else if (line.length) {
      data.dirty = true;
      data.changes++;
    }
  }

  return data;
});
