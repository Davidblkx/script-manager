export enum LogLevel {
  disabled = 0,
  error = 10,
  warning = 20,
  info = 30,
  debug = 40,
  engine = 50,
  all = 100,
}

export interface LogOption {
  /** Log level */
  level: number,
  /** Message to show */
  message: string;
  /** extra params */
  params?: unknown[];
  /** only log, if false */
  assert?: boolean;
  /** timmer name */
  timer?: string;
  /** preserve {} value by stringify */
  preserve?: boolean;
}

export type LogOptionExtra = {
  /** only log, if false */
  $assert?: boolean;
  /** timmer name */
  $timer?: string;
  /** preserve {} value by stringify */
  $preserve?: boolean;
}

export interface LoggerEngine {
  /** Error log */
  error(message: string, ...params: unknown[]): Promise<unknown> | unknown;
  /** Warning log */
  warning(message: string, ...params: unknown[]): Promise<unknown> | unknown;
  /** Info log */
  info(message: string, ...params: unknown[]): Promise<unknown> | unknown;
  /** Debug log */
  debug(message: string, ...params: unknown[]): Promise<unknown> | unknown;
  /** Internal Dinovel log */
  engine(message: string, ...params: unknown[]): Promise<unknown> | unknown;
  /** Default log level */
  default(message: string, ...params: unknown[]): Promise<unknown> | unknown;
}
