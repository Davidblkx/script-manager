export type Status = {
  cmd: 'status';
  short?: boolean;
  branch?: boolean;
  showStash?: boolean;
  porcelain?: boolean | string;
  long?: boolean;
  verbose?: boolean;
  aheadBehind?: boolean;
};

export type Checkout = {
  cmd: 'checkout';
  branch: string;
  b?: boolean;
  B?: boolean;
};

export type GitCommands =
  | Status
  | Checkout;

export type GitAction = Pick<GitCommands, 'cmd'>['cmd'];

export type GitActionRes<T extends GitAction> = T extends 'status' ? {
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
  }
  : T extends 'checkout' ? {
      /** Current branch name */
      branch: string;
      /** True, if branch was created */
      created: boolean;
    }
  : never;
