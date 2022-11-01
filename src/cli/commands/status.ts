import { tty, colors } from 'cliffy/ansi/mod.ts';
import { Table } from 'cliffy/table/table.ts';
import { CliSMX } from '../cli-smx.ts';
import type { RootCommand, RootOptions } from './__.ts';

export function status(cms: RootCommand) {
  cms.command('status')
    .description('Show status of script folder')
    .option('--offline', 'Do not check for updates')
    .option('--clean', 'Print table without border')
    .action(statusAction);
}

interface StatusOptions extends RootOptions {
  offline?: boolean;
  clean?: boolean;
}

async function statusAction(o: StatusOptions) {

  const status = o.offline
    ? await CliSMX.git.status()
    : await CliSMX.git.fetch();

  const table = new Table()
  if (!o.clean) {
    table.border(true);
  }

  if (status.changes > 0) {
    table.push([colors.red('Unsaved changes'), status.changes]);
  }

  if (status.ahead > 0) {
    table.push([colors.yellow('Changes to upload'), status.ahead]);
  }

  if (status.behind > 0) {
    table.push([colors.yellow('Changes to download'), status.behind]);
  }

  if (table.length) {
    tty.text(table.toString());
  } else {
    tty.text(colors.green('Everything up to date\n'));
  }
}
