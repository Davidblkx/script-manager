import { write } from 'tty';

import { getConfigPath } from '../../core/config.ts';
import { rootCommand } from '../sub-command.ts';

export function registerConfigCommand() {
  const config = rootCommand.createSubCommand('config', 'Manage configuration');

  config.apply(
    e => e.command('path')
      .description('Print the path to the configuration file')
      .action(printConfigPath),
  )
}

async function printConfigPath() {
  const path = getConfigPath();
  await write(path, Deno.stdout);
  await write('\n', Deno.stdout);
}
