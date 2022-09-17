import type { SmxCommand } from '../cli.ts';
import { SMXEngine } from '../modules/engine.ts';
import { initRepo, editRepoScripts, getRemote, setRemote, checkRemoteSyncStatus } from './repo/__.ts';

export function registerRepoCommand(command: SmxCommand) {
  command
    .command('repo')
    .description('Manage repository')
    .option('--init', 'Initialize git repository and engine folders')
    .option('--edit', 'Open repo in repository')
    .option('--get-remote', 'Get remote url')
    .option('--set-remote <remote>', 'Set remote url')
    .option('--status', 'Check if remote is in sync with local')
    .option('--path', 'Get path to local repository')
    .action(async (opt) => {
      const engine = await SMXEngine.create();

      if (opt.init) { await initRepo(engine); }
      if (opt.edit) { await editRepoScripts(engine); }
      if (opt.getRemote) { await getRemote(engine); }
      if (opt.setRemote) { await setRemote(engine, opt.setRemote); }
      if (opt.status) { await checkRemoteSyncStatus(engine); }
      if (opt.path) { console.log(engine.config.repo); }
    });

  command
    .command('edit')
    .description('Open repo in favourite editor')
    .action(async () => {
      const engine = await SMXEngine.create();
      await editRepoScripts(engine);
    });
}
