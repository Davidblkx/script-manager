export type CommandTarget = string | URL | {
  default: string | URL;
  [key: string]: string | URL;
};

export type CommandResult = {
  code: number;
  success: boolean;
  stdout?: string;
  stderr?: string;
  error?: Error;
};

export type Subprocess<T> = {
  readonly child: Deno.ChildProcess;
  exec(): Promise<T>;
};

export type SubprocessOptions<T = CommandResult> = {
  target: CommandTarget;
  runOptions?: Deno.CommandOptions;
  handler?: (res: CommandResult) => T;
};

/** Create/Execute a subprocess */
export interface ISubprocessFactory {
  create<T>(options: SubprocessOptions<T>): Subprocess<T>;
  exec<T>(options: SubprocessOptions<T>): Promise<T>;
}
