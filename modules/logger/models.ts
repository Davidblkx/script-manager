export enum LogLevel {
  disabled = 0,
  error = 10,
  warning = 40,
  info = 60,
  debug = 90,
  trace = 95,
  all = 100,
}

export interface LogEntry {
  /** Domain to group log into */
  domain?: string;
  /** Message to show */
  message: string;
  /** Timestamp of log */
  datetime: number;
  /** extra params */
  extra: unknown[];
  /** level */
  level: number;
  /** only log, if false */
  $assert?: boolean;
}

export interface LogFeedSync {
  async: false;
  write(entry: LogEntry): void;
}

export interface LogFeedAsync {
  async: true;
  write(entry: LogEntry): Promise<void>;
}

export type LogFeed = LogFeedSync | LogFeedAsync;

export type Logger = {
  log(entry: Omit<LogEntry, 'datetime' | 'domain'>): Promise<void>;

  error(error: Error): Promise<void>;
  error(message: string, ...extra: unknown[]): Promise<void>;

  warning(message: string, ...extra: unknown[]): Promise<void>;

  info(message: string, ...extra: unknown[]): Promise<void>;

  debug(message: string, ...extra: unknown[]): Promise<void>;

  trace(message: string, ...extra: unknown[]): Promise<void>;

  assert(condition: () => boolean | Promise<boolean>, message?: string, level?: number): Promise<void>;
};

/**
 * Logger factory
 *
 * Factory to create loggers and define feeds
 */
export interface ILoggerFactory {
  readonly level: LogLevel;

  get(domain?: string): Logger;
  setLogLevel(level: number): ILoggerFactory;
  addFeed(feed: LogFeed): ILoggerFactory;
  removeFeed(feed: LogFeed): ILoggerFactory;
  setDatetimeProvider(provider: () => number): ILoggerFactory;
  enableConsole(): ILoggerFactory;
  disableConsole(): ILoggerFactory;
}
