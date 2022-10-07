import { write } from 'tty';
import { join } from 'deno/path/mod.ts';

import { HookHandler, HookProps } from '../exports.ts';
import { logger } from '../../../logger.ts';
import { getFileInfo } from '../../../utils/file.ts';
import { getBinPath, setExecutablePermissions } from "./utils.ts";
import { buildEditorArgs } from '../../../core/editor.ts';

export const _new: HookHandler = {
  help: () => `smx x new -u bin my-script.ts
    Creates a new file in the bin folder and open it in your editor.
  `,
  dry,
  handler,
}

async function handler(props: HookProps) {
  const filePath = await getFile(props);
  if (!filePath) { return; }

  Deno.writeTextFileSync(filePath, '');
  logger.debug(`Created file at ${filePath}.`);

  if (Deno.build.os !== 'windows') {
    await setExecutablePermissions([filePath]);
    logger.debug(`Added executable permissions to ${filePath}.`);
  }

  const editorArgs = buildEditorArgs(filePath);
  logger.debug(`Opening file at ${filePath} with editor ${editorArgs[0]}.`);
  await Deno.run({ cmd: editorArgs }).status();
}

async function dry(props: HookProps) {
  const filePath = await getFile(props);
  if (!filePath) { return; }

  await write(`Create file at ${filePath}\n`, Deno.stdout);
  if (Deno.build.os !== 'windows') {
    await write(`Add executable permissions to ${filePath}\n`, Deno.stdout);
  }
  await write(`Open file at ${filePath}\n`, Deno.stdout);
}

function getFilePath(target: string, name: string) {
  const binPath = getBinPath(target);
  if (!binPath) { return; }

  return join(binPath, name);
}

async function getFile(props: HookProps) {
  if (!props.exclusive) {
    logger.debug('Bin "new" can only be run in exclusive mode.');
    return;
  }

  if (props.args.length === 0) {
    logger.error('Missing file name.');
    return;
  }

  const filePath = getFilePath(props.target, props.args[0]);

  if (!filePath) { return; }

  const info = await getFileInfo(filePath);
  if (info) {
    logger.error(`File already exists at ${filePath}.`);
    return;
  }

  return filePath;
}
