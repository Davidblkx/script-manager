import { Command } from 'cliffy/command/mod.ts';

import { APP_VERSION } from '../version.ts';

export type RootCommand = ReturnType<typeof buildRootCommand>;

export interface RootOptions {
  verbose?: boolean;
  quiet?: boolean;
  config?: string;
  local?: string;
  noLocal?: boolean;
}

export function buildRootCommand() {
    return new Command()
      .name('smx')
      .version(APP_VERSION)
      .description('A simple CLI for managing your scripts')
      .option('-v, --verbose', 'Enable verbose logging', { global: true })
      .option('-q, --quiet', 'Disable logging', { global: true })
      .option('-c, --config <path:string>', 'Path to root config file', { global: true })
      .option('-t, --targetId <string>', 'Target ID to use', { global: true })
      .option('--noLocal', 'Disable loading config from script folder', { global: true })
}
