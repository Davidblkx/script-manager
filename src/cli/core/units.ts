import { write } from 'tty';
import { Table } from 'cliffy/table/mod.ts'

import { rootCommand } from '../sub-command.ts';
import { getAvailableUnits, getSetting, installUnit, setEnableStatus, setSetting } from "../../units.ts";

export function registerUnitsCommands() {
  const units = rootCommand
    .createSubCommand('unit', 'Manage units')
    .aliases('u');

  units.apply(
    e => e.command('list')
      .description('List all units available to install')
      .option('-a, --all', 'List all units, including installed ones')
      .option('-r, --raw', 'Output raw data')
      .action(async (opt) => {
        const units = opt.all ?
          getAvailableUnits()
          : getAvailableUnits().filter((u) => !u.installed);

        const header = ['Id', 'Name', 'Description'];
        if (opt.all) header.push('Status');

        const body: string[][] = units.map((u) => {
          const row = [u.id, u.name, u.description];
          if (opt.all) row.push(u.installed ? u.enabled ? 'enabled' : 'disabled' : 'not installed');
          return row;
        });

        if (opt.raw) {
          for(const row of body) {
            const r = row.join(' ');
            await write(`${r}\n`, Deno.stdout);
          }
          return;
        }

        new Table()
          .header(header)
          .body(body)
          .border(true)
          .render();
      })
  );

  units.apply(
    e => e.command('install')
      .alias('i')
      .description('Install a unit')
      .option('-d, --disable', 'Don\'t enable the unit after installation')
      .arguments('<id:string>')
      .action(async (opt, id) => {
        await installUnit(id, !opt.disable);
      })
  );

  units.apply(
    e => e.command('enable')
      .description('Enable a unit')
      .arguments('<id:string>')
      .action(async (_, id) => {
        await setEnableStatus(id, true);
      })
  );

  units.apply(
    e => e.command('disable')
      .description('Disable a unit')
      .arguments('<id:string>')
      .action(async (_, id) => {
        await setEnableStatus(id, false);
      })
  );

  units.apply(
    e => e.command('setting')
      .alias('set')
      .description('Get/Set a unit setting')
      .option('-d, --delete', 'Delete the setting')
      .arguments('<id:string> <key:string> [value:string]')
      .action(async (opt, id, key, value) => {
        if (opt.delete) {
          await setSetting(id, key, undefined);
          return;
        }

        if (!value) {
          const value = getSetting(id, key);
          await write(`${value}\n`, Deno.stdout);
          return;
        }

        await setSetting(id, key, value);
      })
  );
}
