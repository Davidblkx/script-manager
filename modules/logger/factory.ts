import { ILoggerFactory, LogEntry, LogFeed, LogFeedAsync, LogFeedSync, Logger, LogLevel } from './models.ts';
import { loadConsoleFeed } from './console-feed.ts';

export class LoggerFactory implements ILoggerFactory {
  #level: number = LogLevel.error;
  #syncFeeds = new Set<LogFeedSync>();
  #asyncFeeds = new Set<LogFeedAsync>();
  #getDatetime = () => Date.now();

  get level() {
    return this.#level;
  }

  setLogLevel(level: number): LoggerFactory {
    this.#level = level;
    return this;
  }

  addFeed(feed: LogFeed): LoggerFactory {
    if (feed.async) {
      this.#asyncFeeds.add(feed);
    } else {
      this.#syncFeeds.add(feed);
    }
    return this;
  }

  removeFeed(feed: LogFeed): LoggerFactory {
    if (feed.async) {
      this.#asyncFeeds.delete(feed);
    } else {
      this.#syncFeeds.delete(feed);
    }
    return this;
  }

  setDatetimeProvider(provider: () => number): LoggerFactory {
    this.#getDatetime = provider;
    return this;
  }

  enableConsole(): LoggerFactory {
    return this.addFeed(loadConsoleFeed());
  }

  disableConsole(): LoggerFactory {
    return this.removeFeed(loadConsoleFeed());
  }

  async #write(entry: Omit<LogEntry, 'datetime'>): Promise<void> {
    if (entry.level > this.#level || entry.$assert) {
      return;
    }

    const datetime = this.#getDatetime();
    const entryToWrite = { ...entry, datetime };

    for (const feed of this.#syncFeeds) {
      feed.write(entryToWrite);
    }
    for (const feed of this.#asyncFeeds) {
      await feed.write(entryToWrite);
    }
  }

  get(domain?: string): Logger {
    return new DefaultLogger(this.#write.bind(this), domain ?? '');
  }
}

class DefaultLogger implements Logger {
  #writer: (entry: Omit<LogEntry, 'datetime'>) => Promise<void>;
  #domain: string;

  constructor(writer: (entry: Omit<LogEntry, 'datetime'>) => Promise<void>, domain: string) {
    this.#writer = writer;
    this.#domain = domain;
  }

  log(entry: Omit<LogEntry, 'datetime' | 'domain'>): Promise<void> {
    return this.#writer({ ...entry, domain: this.#domain });
  }

  error(error: Error): Promise<void>;
  error(message: string, ...extra: unknown[]): Promise<void>;
  error(error: unknown, ...extra: unknown[]): Promise<void> {
    const message = error instanceof Error ? error.message : typeof error === 'string' ? error : 'Unknown error';

    return this.#writer({
      domain: this.#domain,
      level: LogLevel.error,
      message,
      extra: error instanceof Error ? [error, ...extra] : extra,
    });
  }

  warning(message: string, ...extra: unknown[]): Promise<void> {
    return this.#writer({
      domain: this.#domain,
      level: LogLevel.warning,
      message,
      extra,
    });
  }

  info(message: string, ...extra: unknown[]): Promise<void> {
    return this.#writer({
      domain: this.#domain,
      level: LogLevel.info,
      message,
      extra,
    });
  }

  debug(message: string, ...extra: unknown[]): Promise<void> {
    return this.#writer({
      domain: this.#domain,
      level: LogLevel.debug,
      message,
      extra,
    });
  }

  trace(message: string, ...extra: unknown[]): Promise<void> {
    return this.#writer({
      domain: this.#domain,
      level: LogLevel.trace,
      message,
      extra,
    });
  }

  async assert(
    condition: () => boolean | Promise<boolean>,
    message?: string | undefined,
    level?: number | undefined,
  ): Promise<void> {
    const assert = await tryRun(condition);

    return this.#writer({
      domain: this.#domain,
      level: level ?? LogLevel.error,
      message: message ?? 'Assertion failed',
      extra: [],
      $assert: assert,
    });
  }
}

async function tryRun(fn: () => boolean | Promise<boolean>): Promise<boolean> {
  try {
    return await fn();
  } catch {
    return false;
  }
}

export const globalLogger = new LoggerFactory();
