import type { SmxCommand } from '../cli.ts';
import { SMXEngine } from '../modules/engine.ts';
import { initRepo, editRepoScripts } from './repo/__.ts';

export function registerRepoCommand(command: SmxCommand) {

  const subCommands = ['--init'];
  const exclude = (s: string) => subCommands.filter((c) => c !== s);

  command
    .command('repo')
    .description('Manage repository')
    .option('--init', 'Initialize git repository and engine folders', { conflicts: exclude('--init') })
    .option('--edit', 'Open repo in repository', { conflicts: exclude('--edit') })
    .action(async (opt) => {
      const engine = await SMXEngine.create();

      if (opt.init) { await initRepo(engine); }
      if (opt.edit) { await editRepoScripts(engine); }
    });
}
