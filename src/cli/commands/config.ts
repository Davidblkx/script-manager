import { tty, colors } from 'cliffy/ansi/mod.ts';
import type { RootCommand, RootOptions } from './__.ts';
import { CliSMX } from '../cli-smx.ts';
import { Table } from 'https://deno.land/x/cliffy@v0.25.2/table/table.ts';

export function config(cmd: RootCommand) {
  cmd.command('config')
    .arguments('[key] [value]')
    .option('-g, --global', 'Set the global configuration')
    .option('-u, --target', 'Set the current target configuration')
    .option('-d, --delete', 'Delete the configuration entry')
    .option('-l, --list', 'List all configuration entries')
    .option('--filter <string>', 'Regex to filter the list of configuration entries', { depends: ['list'] })
    .option('--clean', 'Print table without border and headers', { depends: ['list'] })
    .description('Get or set a configuration value')
    .action(configAction);
}

interface ExtraOptions {
  global?: boolean;
  target?: boolean;
  delete?: boolean;
  list?: boolean;
  filter?: string;
  clean?: boolean;
}

async function configAction(o: RootOptions & ExtraOptions, key?: string, value?: string) {
  if (typeof value === 'undefined' && o.quiet) { return; }

  if (o.list) {
    listSettings(o.filter, o.clean);
    return;
  }

  if (!key) {
    if (o.quiet) { return; }
    CliSMX.logger.error('No key specified');
    Deno.exit(1);
  }

  const configType = o.global ? 'global' : o.target ? 'target' : 'local';

  if (o.delete) {
    await deleteConfig(key, configType, o.quiet);
    return;
  }

  if (typeof value !== 'undefined') {
    await setConfigValue(key, configType, value, o.quiet);
    return;
  }

  // Fix load first setting target -> local -> global
  const currentValue = o.global
    ? CliSMX.settings.getSetting(key, 'global')
    : CliSMX.settings.getSetting(key);
  if (currentValue === undefined || currentValue === null) { return; }
  const formatedValue = Array.isArray(currentValue) ? currentValue.join(', ') : currentValue.toString();
  tty.text(formatedValue);
}

async function deleteConfig(key: string, configType: 'global' | 'target' | 'local', quiet = false) {
  CliSMX.logger.debug(`Deleting ${configType} config key ${key}`);
  const res = await CliSMX.settings.deleteSetting(key, configType);
  if (!res) {
    CliSMX.logger.error(`Could not delete ${configType} config key ${key}`);
    Deno.exit(1);
  }
  if (quiet) { return; }
  const msg = `Deleted ${configType} config key ${key}`;
  tty.text(colors.green(msg));
}

async function setConfigValue(key: string, configType: 'global' | 'target' | 'local', value: string, quiet = false) {
  CliSMX.logger.debug(`Setting ${configType} config key ${key} to ${value}`);
  const res = await CliSMX.settings.setSetting(key, value, configType);
  if (!res) {
    CliSMX.logger.error(`Could not set ${configType} config key ${key} to ${value}`);
    Deno.exit(1);
  }
  if (quiet) { return; }
  const msg = `Set ${configType} config key ${key} to ${value} [${configType}]`;
  tty.text(colors.green(msg));
}

function listSettings(filter?: string, clean = false) {
  const settings = CliSMX.settings.bundle();
  let keys = Object.keys(settings);

  if (filter) {
    const regex = new RegExp(filter);
    keys = keys.filter((key) => regex.test(key));
  }

  if (keys.length === 0) { return; }
  const table = new Table();
  if (!clean) {
    table.header(['Key', 'Value']);
    table.border(true);
    table.align('left', true);
  }

  keys.forEach((k) => {
    const value = settings[k];
    const formatedValue = Array.isArray(value) ? value.join(', ') : value?.toString() ?? 'undefined';
    table.push([k, formatedValue]);
  });
  tty.text(table.toString());
}
