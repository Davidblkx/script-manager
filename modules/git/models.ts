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

/** Allow to register custom git commands, that can be reused later by an handler */
export interface IGitCommandBuilder {
  register<P, R>(command: GitGenericCommand<P, R>): void;
  buildCommand<T extends GitCommands, K extends GitAction>(
    command: T & { cmd: K },
  ): GitGenericCommand<T, GitActionRes<K>>;
  build<P, R>(command: P & { cmd: string }): GitGenericCommand<P, R>;
}

/** Entry point to run GIT commands, responsible to generate the actually git call */
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

/** High level GIT interface */
export interface IGit {
  status(cwd?: string): Promise<GitStatus>;
  isGit(cwd?: string): Promise<boolean>;
  checkout(branch: string, create?: boolean, cwd?: string): Promise<GitStatus>;
}
