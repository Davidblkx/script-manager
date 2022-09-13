import { Command } from 'cliffy/command/mod.ts';
import { getConfigPath, checkConfigExists } from './utils/config.ts';
import { registerCommands } from './commands/__.ts';

const DEFAULT_COMMAND = new Command()
  .name('smx')
  .version('0.1.0')
  .globalOption('-v, --verbose', 'Enable verbose logging')
  .globalOption('-q, --quiet', 'Disable logging')
  .description('A CLI to sync scripts from a remote repository.');

export type SmxCommand = typeof DEFAULT_COMMAND;

export async function buildCommand() {
  const hasConfig = await ensureConfig();
  if (!hasConfig) return;

  registerCommands(DEFAULT_COMMAND);
  return DEFAULT_COMMAND;
}

async function ensureConfig(): Promise<boolean> {

  if (await checkConfigExists()) {
    return true;
  } else {
    console.log(`Config file not found at ${getConfigPath()}`);
    console.info('Run `smx --init` to create a new config file.');
    return false;
  }
}
