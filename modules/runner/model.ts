export interface IRunner {
  name: string;
  description?: string;
  target: RegExp;
  run: (file: URL, args: string[]) => Promise<IRunResult>;
}

export interface IRunResult {
  success: boolean;
  message?: string;
  data?: unknown;
}

export interface IRun {
  runner: IRunner;
  file: URL;
  args: string[];
  run: () => Promise<IRunResult>;
}

export interface IRunnerStore {
  readonly list: IRunner[];

  add(runner: IRunner): void;
  remove(runner: IRunner): void;

  default(): IRunner;
  setDefault(runner: IRunner): void;
  clearDefault(): void;

  create(file: URL, args: string[]): IRun;
  has(file: URL): boolean;
}

export function isRunResult(value: unknown): value is IRunResult {
  return typeof value === 'object' && value !== null &&
    typeof (value as IRunResult).success === 'boolean';
}
