import { write } from 'tty';

import { getConfig } from '../../core/config.ts';
import { rootCommand } from '../sub-command.ts';
import { createTarget, getTargetByName, getTargetById, setName, setDefault, setSetting, deleteTarget, buildTargetPath } from '../../core/target.ts';
import { logger } from '../../logger.ts';

export function registerTargetCommands() {
  const target = rootCommand
    .createSubCommand('target', 'Manage targets',
      cmd =>
        cmd.option('-i, --id <target>', 'Target id to use', { conflicts: ['name'], global: true })
          .option('-n, --name <name>', 'Target name to use', { conflicts: ['id'], global: true })
    ).aliases('t');

  target.apply(
    e => e.command('create')
      .description('Create a new target')
      .option('-d, --default', 'Set as default target')
      .option('-p, --print', 'Print the target id')
      .arguments('<name>')
      .action(async (opt, name) => {
        const t = await createTarget(name, opt.default);
        if (!t) { return; }
        if (opt.print) {
          await write(t.id, Deno.stdout);
          await write('\n', Deno.stdout);
        }
      })
  );

  target.apply(
    e => e.command('list')
      .description('List all targets')
      .action(async () => {
        const cfg = getConfig();
        const targets = Object.values(cfg.targets);
        for (const t of targets) {
          const def = t.id === cfg.default ? '*' : ' ';
          await write(`${def} ${t.name} ${t.id}\n`, Deno.stdout);
        }
      })
  );

  target.apply(
    e => e.command('rename')
      .description('Rename a target')
      .arguments('<name>')
      .action((opt, name) => {
        const target = opt.name ? getTargetByName(opt.name) : getTargetById(opt.id);
        if (!target) {
          logger.error(`Target ${opt.name || opt.id} not found`);
          return;
        }
        setName(target, name);
      })
  );

  target.apply(
    e => e.command('set-default')
      .description('Set a target as default')
      .option('-p, --print', 'Print the target id')
      .action(async (opt) => {
        const target = opt.name ? getTargetByName(opt.name) : getTargetById(opt.id);
        if (!target) {
          logger.error(`Target ${opt.name || opt.id} not found`);
          return;
        }

        await setDefault(target);

        if (opt.print) {
          await write(target.id, Deno.stdout);
          await write('\n', Deno.stdout);
        }
      })
  );

  target.apply(
    e => e.command('setting')
      .alias('set')
      .description('Manage target settings')
      .option('-d, --delete', 'Delete the setting')
      .arguments('<key:string> [value:string]')
      .action(async (opt, key, value) => {
        const target = opt.name ? getTargetByName(opt.name) : getTargetById(opt.id);
        if (!target) {
          logger.error(`Target ${opt.name || opt.id} not found`);
          return;
        }

        if (!value && !opt.delete) {
          await write(target.settings[key] || '', Deno.stdout);
          await write('\n', Deno.stdout);
          return;
        }

        await setSetting(target, key, value);
      })
  );

  target.apply(
    e => e.command('delete')
      .alias('del')
      .description('Delete a target')
      .action(async (opt) => {
        const target = opt.name ? getTargetByName(opt.name) : getTargetById(opt.id);
        if (!target) {
          logger.error(`Target ${opt.name || opt.id} not found`);
          return;
        }

        await deleteTarget(target);
      })
  );

  target.apply(
    e => e.command('path')
      .description('Print the target folder path')
      .action(async (opt) => {
        const target = opt.name ? getTargetByName(opt.name) : getTargetById(opt.id);
        if (!target) {
          logger.error(`Target ${opt.name || opt.id} not found`);
          return;
        }

        await write(buildTargetPath(target), Deno.stdout);
        await write('\n', Deno.stdout);
      })
  );
}
