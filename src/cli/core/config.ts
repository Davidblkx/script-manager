import { write } from 'tty';

import { getConfigPath, getConfig } from '../../core/config.ts';
import { setFolder } from '../../core/folder.ts';
import { rootCommand } from '../sub-command.ts';
import { getEditor, setEditor, TARGET_NAME } from '../../core/editor.ts';

export function registerConfigCommand() {
  const config = rootCommand
    .createSubCommand('config', 'Manage configuration')
    .aliases('cfg');

  config.apply(e => e.action(printConfigPath));

  config.apply(
    e => e.command('get-path')
      .description('Return the path to the configuration file')
      .action(printConfigPath),
  )

  config.apply(
    e => e.command('get-editor')
      .description('Return arguments to open the editor')
      .action(writeEditor),
  )

  config.apply(
    e => e.command('set-editor')
      .description('Set arguments to open editor')
      .option('-p, --print', 'Print the editor params')
      .arguments('<arg1,arg2>')
      .usage(`-p "code,--wait,${TARGET_NAME}"`)
      .action(async (opt, args) => {
        const params = typeof args === 'string' ? args.split(',') : [];
        await setEditor(...params);

        if (opt.print) {
          await writeEditor();
        }
      }),
  );

  config.apply(
    e => e.command('get-folder')
      .description('Return the path to the script folder')
      .action(writeFolder),
  );

  config.apply(
    e => e.command('set-folder')
      .description('Set the path to the script folder')
      .option('-m, --move', 'Move folder for scripts')
      .option('-p, --print', 'Print the folder path')
      .arguments('<path:file>')
      .action(async (opt, path: string) => {
        await setFolder(path, opt.move);

        if (opt.print) {
          await writeFolder();
        }
      }),
  );
}

async function printConfigPath() {
  const path = getConfigPath();
  await write(path, Deno.stdout);
  await write('\n', Deno.stdout);
}

async function writeEditor() {
  const path = getEditor();
  await write(path, Deno.stdout);
  await write('\n', Deno.stdout);
}

async function writeFolder() {
  const path = getConfig().folder;
  await write(path, Deno.stdout);
  await write('\n', Deno.stdout);
}
