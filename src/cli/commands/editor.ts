import type { RootCommand, RootOptions } from './__.ts';
import { getFolder } from '../../modules/utils/file.ts';
import { CliSMX } from '../cli-smx.ts';
import { logger } from '../../modules/logger.ts';

export function editorCommand(cmd: RootCommand) {
  cmd.command('edit')
    .description('Open editor')
    .option('-n, --name <name:string>', 'Name of the editor to use')
    .option('-g, --global', 'Edit global configuration')
    .option('-a, --all', 'Edit all scripts')
    .action(editAction);
}

interface EditOptions {
  name?: string;
  global?: boolean;
  all?: boolean;
}

async function editAction(o: RootOptions & EditOptions) {
  if (o.global) {
    const path = CliSMX.config.globalFile?.path;
    if (!path) {
      logger.error('Global configuration file not found');
      Deno.exit(1);
    }
    await CliSMX.editor.edit(path, o.name);
  } else if (o.all) {
    const path = CliSMX.config.localFile?.path;
    if (!path) {
      logger.error('Local configuration file not found');
      Deno.exit(1);
    }
    const folder = getFolder(path);
    await CliSMX.editor.edit(folder, o.name);
  } else {
    const target = await CliSMX.targets.current();
    await CliSMX.editor.edit(target.path, o.name);
  }
}
