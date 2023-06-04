export type CommandParams = Record<string, string | number | boolean>;
export type CommandName<C extends string> = { cmd: C };
export type Command<P extends CommandParams, C extends string> = P & CommandName<C>;

export type CommandResult<P extends CommandParams, C extends string> = {
  spec: Command<P, C>;
  code: number;
  success: boolean;
  stdout?: string;
  stderr?: string;
  error?: Error;
};

export type CommandSpec<P extends CommandParams, C extends string, T> = {
  command: C;
  params: P;
  parser: (result: CommandResult<P, C>) => Promise<T> | T;
};

// deno-lint-ignore no-explicit-any
export type AppSpec = Record<string, CommandSpec<any, any, any>>;

export type AppTarget = string | URL | {
  default: string | URL;
  [key: string]: string | URL;
};

export interface IAppInterface<T extends AppSpec> {
  readonly target: AppTarget;
  readonly spec: T;
  run<P extends keyof T>(
    key: P,
    params?: Partial<T[P]['params']>,
    options?: Deno.CommandOptions,
  ): Promise<ReturnType<T[P]['parser']>>;
  extend<T2 extends AppSpec>(spec: T2): IAppInterface<T & T2>;
}

export interface IAppInterfaceFactory {
  create<T extends AppSpec>(target: AppTarget, spec: T): IAppInterface<T>;
}
