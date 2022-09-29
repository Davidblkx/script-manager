import { write } from 'tty';

import { rootCommand } from '../sub-command.ts';
import { setFolder } from '../../core/folder.ts';
import { getConfig } from '../../core/config.ts';

export function registerFolder() {
  const folder = rootCommand.createSubCommand('folder', 'Get/Set folder for scripts');

  folder.apply(e => e.action(writeFolder));

  folder.apply(
    e => e.command('get')
      .description('Print the path to the folder')
      .action(writeFolder)
  );

  folder.apply(
    e => e.command('set')
      .description('Set the path to the folder')
      .option('-m, --move', 'Move folder for scripts')
      .arguments('<path:file>')
      .action(async (opt, path: string) => {
        await setFolder(path, opt.move);
      })
  );
}

async function writeFolder() {
  const path = getConfig().folder;
  await write(path, Deno.stdout);
  await write('\n', Deno.stdout);
}
