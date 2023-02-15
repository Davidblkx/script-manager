import { LogFeedSync, LogLevel } from './models.ts';
import { ConsoleTarget } from './console-feed.ts';
import { colors } from '$cliffy/ansi/mod.ts';

let logFeed: LogFeedSync | undefined;
export type TerminalColorMap = {
  debug: keyof typeof colors;
  info: keyof typeof colors;
  warn: keyof typeof colors;
  error: keyof typeof colors;
}

export function createTerminalFeed(target: ConsoleTarget, colorMap: TerminalColorMap): LogFeedSync {
  return {
    async: false,
    write(entry) {
      const { domain, message, level, extra, datetime } = entry;
      const prefix = domain ? `[${domain}]` : '';
      const date = new Date(datetime).toISOString();

      let key: 'debug' | 'info' | 'warn' | 'error' = 'debug';

      if (level <= LogLevel.error) {
        key = 'error';
      } else if (level <= LogLevel.warning) {
        key = 'warn';
      } else if (level <= LogLevel.info) {
        key = 'info';
      }

      const colorize = colors[colorMap[key]] as unknown as (text: string) => string;
      const messageWithPrefix = colorize(`${date}: ${prefix}${message}`);
      target[key](messageWithPrefix, ...extra);
    }
  };
}

export function loadTerminalFeed(): LogFeedSync {
  if (logFeed) {
    return logFeed;
  }

  const console = globalThis.console;
  if (!console) { throw new Error('No console available'); }

  logFeed = createTerminalFeed(console, {
    debug: 'cyan',
    error: 'red',
    info: 'green',
    warn: 'yellow'
  });
  return logFeed;
}
