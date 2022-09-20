import { write } from 'tty';

import { TOP } from '../utils.ts';
import { setFolder } from '../../core/folder.ts';
import { getConfig } from '../../core/config.ts';

export const FOLDER = TOP(
  cmd => cmd.command('folder')
    .description('Get/Set folder for scripts')
    .option('-s, --set <folder>', 'Set folder for scripts')
    .option('-m, --move', 'Move folder for scripts')
    .action(async (options) => {
      if (options.set) {
        await setFolder(options.set, options.move);
      } else {
        const config = getConfig();
        await write(config.folder, Deno.stdout);
        await write('\n', Deno.stdout);
      }
    })
);
