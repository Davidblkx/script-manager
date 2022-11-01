import { tty } from 'cliffy/ansi/mod.ts';
import { Table } from 'cliffy/table/table.ts';

import type { RootCommand, RootOptions } from './__.ts';
import { CliSMX } from '../cli-smx.ts';
import { getFolder } from '../../modules/utils/file.ts';

export function where(cmd: RootCommand) {
  cmd.command('where')
    .description('Prints the location of the configuration file and the script folder')
    .action(printWhere);
}

function printWhere(o: RootOptions) {
  if (o.quiet) { return; }

  const global = CliSMX.config.globalFile?.path;
  const local = CliSMX.config.localFile?.path;

  const output: string[][] = [];

  if (global) { output.push(['Configuration:', global]); }
  if (local) {
    output.push(['Script Folder:', getFolder(local)]);
  }

  tty.text(new Table(...output).toString());
}
