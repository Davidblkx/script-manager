import type { RootOptions } from './root.ts';
import { initScritpManager } from '../core/init.ts';
import { LogLevel } from '../modules/logger.ts';

export function loadSMX(opt: RootOptions) {
  return initScritpManager({
    globalConfigPath: opt.config,
    initLocalPath: !opt.noLocal,
    localConfigPath: opt.local,
    logLevel: opt.quiet ? LogLevel.disabled : opt.verbose ? LogLevel.debug : LogLevel.warning,
    quiet: opt.quiet,
  });
}
