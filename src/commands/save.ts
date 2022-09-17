import type { SmxCommand } from '../cli.ts';
import { SMXEngine } from '../modules/engine.ts';
import { checkStatus, commitChanges } from './save/__.ts';

export function registerSaveCommand(command: SmxCommand) {
  command
    .command('save')
    .description('Save scripts to repository')
    .option('-m, --message <message>', 'Commit message')
    .option('--status', 'Check if there are any changes to save')
    .action(async (opt) => {
      const engine = await SMXEngine.create();

      if (opt.status) { await checkStatus(engine); }
      else { await commitChanges(engine, opt.message); }
    });

  command
    .command('status')
    .description('Check if there are any changes to save')
    .action(async () => {
      const engine = await SMXEngine.create();
      await checkStatus(engine);
    });
}
