import type { GitAction, GitActionRes, GitCommands } from './commands.ts';

export interface GitResult<T = unknown> {
  params: Record<string, string | number | boolean | undefined>;
  stdout: string;
  stderr: string;
  code: number;
  failReason?: string;
  data?: T;
}

export type GitGenericCommand<P, R> = {
  params: P & { cmd: string };
  parser: (res: GitResult) => GitResult<R>;
};

export interface IGitCommandBuilder {
  register<P, R>(command: GitGenericCommand<P, R>): void;
  buildCommand<T extends GitCommands, K extends GitAction>(
    command: T & { cmd: K },
  ): GitGenericCommand<T, GitActionRes<K>>;
  build<P, R>(command: P & { cmd: string }): GitGenericCommand<P, R>;
}

export interface IGitHandler {
  runRaw(args: string[], cwd?: string): Promise<{ stdout: string; stderr: string; code: number }>;
  runCommand<T extends GitCommands, K extends GitAction>(
    command: T & { cmd: K },
    cwd?: string,
  ): Promise<GitResult<GitActionRes<K>>>;
  runCustom<P, R>(command: P & { cmd: string }, cwd?: string): Promise<GitResult<R>>;
  run<P, R>(command: GitGenericCommand<P, R>, cwd?: string): Promise<GitResult<R>>;
}

export type GitStatus = {
  dirty: boolean;
  ahead: number;
  behind: number;
  changes: number;
  branch: string;
  remote?: string;
};

export interface IGit {
  status(cwd?: string): Promise<GitStatus>;
  isGit(cwd?: string): Promise<boolean>;
  checkout(branch: string, create?: boolean, cwd?: string): Promise<GitStatus>;
}
