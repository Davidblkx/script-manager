import { tty, colors } from 'cliffy/ansi/mod.ts';
import { Table } from 'cliffy/table/table.ts';
import { EnumType } from 'cliffy/command/mod.ts';

import type { RootCommand, RootOptions } from './__.ts';

import { CliSMX } from '../cli-smx.ts';
import { logger } from '../../modules/logger.ts';

enum Reset {
  all = 'all',
  settings = 'settings',
  content = 'content',
}

const resetType = new EnumType<Reset>(Reset);

export function target(cmd: RootCommand) {
  cmd.command('target')
    .type('reset', resetType)
    .description('Manage target')
    .option('-l, --list', 'List all targets')
    .option('--filter <string>', 'Regex to filter the list of configuration entries', { depends: ['list'] })
    .option('--clean', 'Print table without border and headers', { depends: ['list'] })
    .option('--default', 'Get/Set target as default', { standalone: true })
    .option('--reset [type:reset]', 'Reset default target', { standalone: true })
    .option('--init', 'Initialize target', { standalone: true })
    .option('--delete', 'Delete target', { standalone: true })
    .option('--status', 'Get target status', { standalone: true })
    .action(targetAction);
}

export interface ExtraOptions {
  list?: boolean;
  filter?: string;
  clean?: boolean;
  default?: boolean;
  reset?: true | Reset;
  init?: boolean;
  delete?: boolean;
  status?: boolean;
}

async function targetAction(o: RootOptions & ExtraOptions) {
  if (o.list) {
    printList(o);
  } else if (o.default) {
    await setDefault(o);
  } else if (o.reset) {
    await resetTarget(o);
  } else if (o.init) {
    await initTarget(o);
  } else if (o.delete) {
    await deleteTarget(o);
  } else if (o.status) {
    await statusTarget(o);
  } else {
    logger.error('No action specified');
  }
}

export function printList(o: RootOptions & ExtraOptions) {
  if (o.quiet) { return; }
  const defaultId = CliSMX.SMXSettings.targets.default;

  const targetList = CliSMX.config.localFile?.config.targets;
  if (!targetList) {
    CliSMX.logger.error('No targets found');
    Deno.exit(1);
  }

  const table = new Table();
  if (!o.clean) {
    table.header(['', 'ID', 'Name']);
    table.border(true);
    table.align('left', true);
  }

  for (const [_, target] of Object.entries(targetList)) {
    if (o.filter && !target.name.match(o.filter)) { continue; }

    const row = [target.id === defaultId ? '*' : ' ', target.id, target.name];
    if (!o.clean && target.id === defaultId) {
      row[0] = colors.green(row[0]);
      row[1] = colors.green(row[1]);
      row[2] = colors.green(row[2]);
    }

    table.push(row);
  }

  tty.text(table.toString());
}

export async function setDefault(o: RootOptions & ExtraOptions) {
  const target = await CliSMX.targets.current();
  await target.setDefault();
  if (!o.quiet) {
    const message = `Target ${target.id} is now the default target\n`;
    tty.text(colors.green(message));
  }
  return;
}

export async function resetTarget(o: RootOptions & ExtraOptions) {
  if (!o.reset) { return; }
  const target = await CliSMX.targets.current();
  const resetType = o.reset === true ? Reset.all : o.reset;
  await target.reset(resetType);
  if (!o.quiet) {
    const message = `Target ${target.id} was reset\n`;
    tty.text(colors.green(message));
  }
}

export async function initTarget(o: RootOptions & ExtraOptions) {
  if (!o.init) { return; }
  const target = await CliSMX.targets.current();
  await target.init(false);
  if (!o.quiet) {
    const message = `Target ${target.id} was initialized\n`;
    tty.text(colors.green(message));
  }
}

export async function deleteTarget(o: RootOptions & ExtraOptions) {
  if (!o.delete) { return; }
  const target = await CliSMX.targets.current();

  if (target.isDefault) {
    CliSMX.logger.error('Cannot delete default target');
    Deno.exit(1);
  }

  await target.delete();
  if (!o.quiet) {
    const message = `Target ${target.id} was deleted\n`;
    tty.text(colors.green(message));
  }
}

export async function statusTarget(o: RootOptions & ExtraOptions) {
  if (!o.status || o.quiet) { return; }
  const target = await CliSMX.targets.current();

  const isDefault = target.isDefault;
  const hasFolder = target.initialized;

  const table = new Table();

  const bool = (value: boolean) => value ? 'Yes' : colors.red('No');

  table.push(['ID', target.id]);
  table.push(['Name', target.name]);
  table.push(['Default', isDefault ? 'Yes' : 'No']);
  table.push(['Initialized', bool(hasFolder)]);

  tty.text(table.toString());
}
