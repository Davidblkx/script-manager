import { LogFeedSync, LogLevel } from './models.ts';

export type ConsoleTarget = {
  debug(...args: unknown[]): void;
  info(...args: unknown[]): void;
  warn(...args: unknown[]): void;
  error(...args: unknown[]): void;
};

let logFeed: LogFeedSync | undefined;

export function createConsoleFeed(target: ConsoleTarget): LogFeedSync {
  return {
    async: false,
    write(entry) {
      const { domain, message, level, extra, datetime } = entry;
      const prefix = domain ? `[${domain}]` : '';
      const date = new Date(datetime).toISOString();
      const messageWithPrefix = `${date}: ${prefix}${message}`;

      let key: 'debug' | 'info' | 'warn' | 'error' = 'debug';

      if (level <= LogLevel.error) {
        key = 'error';
      } else if (level <= LogLevel.warning) {
        key = 'warn';
      } else if (level <= LogLevel.info) {
        key = 'info';
      }

      target[key](messageWithPrefix, ...extra);
    }
  };
}

export function loadConsoleFeed(): LogFeedSync {
  if (logFeed) {
    return logFeed;
  }

  const console = globalThis.console;
  if (!console) { throw new Error('No console available'); }

  logFeed = createConsoleFeed(console);
  return logFeed;
}
