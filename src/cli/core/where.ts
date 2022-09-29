import { write } from 'tty';

import { getConfig } from '../../core/config.ts';
import { rootCommand } from '../sub-command.ts';

export function registerWhere() {
  const where = rootCommand.createSubCommand('where', 'Print the path to the configuration file');
  where.apply(e => e.action(printWhere));
}

async function printWhere() {
  const path = getConfig().folder;
  await write(path, Deno.stdout);
  await write('\n', Deno.stdout);
}
