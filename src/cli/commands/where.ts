import { tty } from 'cliffy/ansi/mod.ts';
import { Table } from 'cliffy/table/table.ts';

import type { RootCommand, RootOptions } from './__.ts';
import { loadSMX } from '../load-smx.ts';

export function where(cmd: RootCommand) {
  cmd.command('where')
    .description('Prints the location of the configuration file and the script folder')
    .action(printWhere);
}

async function printWhere(o: RootOptions) {
  if (o.quiet) { return; }

  const sm = await loadSMX(o);

  const global = sm.config.globalFile?.path;
  const local = sm.config.localFile?.path;

  const output: string[][] = [];

  if (global) { output.push(['Configuration:', global]); }
  if (local) { output.push(['Script Folder:', local]); }

  tty.text(new Table(...output).toString());
}
