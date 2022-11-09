import type { RootCommand, RootOptions } from './__.ts';
import { CliSMX } from '../cli-smx.ts';

export function execute(cmd: RootCommand) {
  cmd.command('execute')
    .alias('x')
    .description('Executes a script')
    .arguments('<name:string> -- [args...:string]')
    .action(executeScript);
}

async function executeScript(_: RootOptions, name: string) {
  await CliSMX.scripts.run(name, CliSMX);
}
