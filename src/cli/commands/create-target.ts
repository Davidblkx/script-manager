import { tty } from 'cliffy/ansi/mod.ts';

import type { RootCommand, RootOptions } from './__.ts';

import { CliSMX } from '../cli-smx.ts';

export function createTarget(cmd: RootCommand) {
  cmd.command('create-target')
    .arguments('<name:string> [id:string]')
    .description('Create a new target')
    .option('-d, --default', 'Set target as default')
    .action(createTargetAction);
}

export interface ExtraOptions {
  default?: boolean;
}

async function createTargetAction(o: RootOptions & ExtraOptions, name: string, id?: string) {
  const target = await CliSMX.targets.create(name, id, o.default);
  if (o.quiet) { return }
  tty.text(target.id);
}
