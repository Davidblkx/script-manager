import { Command } from 'cliffy/command/mod.ts';
import { getHomeDirectory } from './utils/config.ts';
import { loadConfig, version } from './core/__.ts';
import { logger, LogLevel } from './logger.ts';

const DEFAULT_COMMAND = new Command()
  .name('smx')
  .description('Script Manager for personal scripts and dotfiles')
  .version(version)
  .globalOption('-v, --verbose', 'Enable verbose logging')
  .globalOption('-q, --quiet', 'Disable logging')
  .description('A CLI to sync scripts from a remote repository.');

export type SmxCommand = typeof DEFAULT_COMMAND;

export async function buildCommand(opt: { verbose?: boolean; quiet?: boolean } = {}): Promise<SmxCommand> {
  if (opt.quiet) {
    logger.setLogLevel(LogLevel.disabled);
  } else if (opt.verbose) {
    logger.setLogLevel(LogLevel.all);
  } else {
    logger.setLogLevel(LogLevel.info);
  }

  const home = getHomeDirectory() || '~';
  await loadConfig(home, true);



  return DEFAULT_COMMAND;
}
