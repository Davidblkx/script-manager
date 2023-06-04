import type { InternalGitSpec } from './default-spec.ts';

export type GitCommandParams = Record<string, string | number | boolean>;
export type GitCommandName<C extends string> = { cmd: C };
export type GitCommand<P extends GitCommandParams, C extends string> =
  & P
  & GitCommandName<C>;

export type GitResult<
  P extends GitCommandParams,
  C extends string,
  T = never,
> = {
  command: GitCommand<P, C>;
  stdout: string;
  stderr: string;
  code: number;
  failReason?: string;
  data: T;
};

export type GitCommandSpec<
  P extends GitCommandParams,
  C extends string,
  T,
> = {
  command: C;
  params: P;
  parser: (result: GitResult<P, C>) => Promise<GitResult<P, C, T | undefined>>;
}

// deno-lint-ignore no-explicit-any
export type GitSpec = Record<string, GitCommandSpec<any, any, any>>;

export interface IGitSpecRunner<T extends GitSpec> {
  run<P extends keyof T>(key: P, params?: Partial<T[P]["params"]>, cwd?: string): Promise<ReturnType<T[P]["parser"]>>;
}

export interface IGit {
  readonly spec: IGitSpecRunner<InternalGitSpec>;
  raw(args: string[], cwd?: string): Promise<{ stdout: string; stderr: string; code: number }>;
  run<P extends GitCommandParams, C extends string, T = unknown>(GitCommandSpec: GitCommandSpec<P, C, T>, cwd?: string): Promise<GitResult<P, C, T | undefined>>;
  createSpecRunner<T extends GitSpec>(spec: T): IGitSpecRunner<T>;
}
