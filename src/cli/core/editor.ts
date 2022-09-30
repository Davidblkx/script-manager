import { write } from 'tty';

import { rootCommand } from '../sub-command.ts';
import { getEditor, setEditor } from '../../core/editor.ts';

async function writeEditor() {
  const path = getEditor();
  await write(path, Deno.stdout);
  await write('\n', Deno.stdout);
}

export function registerEditor() {
  const editor = rootCommand.createSubCommand('editor', 'Get/Set editor for scripts');

  editor.apply(e => e.action(writeEditor));

  editor.apply(
    e => e.command('get')
      .description('Print the editor')
      .action(writeEditor)
  );

  editor.apply(
    e => e.command('set')
      .description('Set the editor')
      .option('-p, --print', 'Print the editor params')
      .arguments('<params split by comma>')
      .action(async (opt, args) => {
        const params = typeof args === 'string' ? args.split(',') : [];
        await setEditor(...params);

        if (opt.print) {
          await writeEditor();
        }
      })
  );
}
