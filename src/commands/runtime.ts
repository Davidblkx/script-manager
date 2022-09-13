import type { SmxCommand } from '../cli.ts';

export function registerRuntimeCommands(command: SmxCommand) {
  command
    .command('runtime')
    .description('Manage runtimes')
    .action(() => {
      console.log('runtimes list here');
    });
}
