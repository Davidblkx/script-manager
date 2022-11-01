export interface GitStatus {
  dirty: boolean;
  ahead: number;
  behind: number;
  changes: number;
  canPull: boolean;
  canPush: boolean;
  isGit: boolean;
  branch: string;
  remote?: string;
}

export interface IGitHandler {
  readonly online: boolean;
  readonly initialized: boolean;

  checkout(): Promise<GitStatus>;
  init(): Promise<GitStatus>;
  commit(message: string): Promise<GitStatus>;
  push(force?: boolean): Promise<GitStatus>;
  pull(force?: boolean): Promise<GitStatus>;
  reset(): Promise<GitStatus>;
  status(): Promise<GitStatus>;
  setOrigin(url: string): Promise<GitStatus>;
  getOrigin(): Promise<false | string>;
  fetch(): Promise<GitStatus>;
  clone(url: string): Promise<GitStatus>;
  hasCommit(): Promise<boolean>;
}
