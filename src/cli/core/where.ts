import { write } from 'tty';

import { TOP } from '../utils.ts';
import { getConfigPath } from '../../core/config.ts';

export const WHERE = TOP(
  cmd => cmd.command('where')
    .description('Show config path')
    .action(async () => {
      const path = getConfigPath();
      await write(path, Deno.stdout);
      await write('\n', Deno.stdout);
    })
);
