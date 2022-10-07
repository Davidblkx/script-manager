import { write } from 'tty';
import { join } from 'deno/path/mod.ts';

import { HookHandler, HookProps } from '../exports.ts';
import { logger } from '../../../logger.ts';
import { getBinPath, setExecutablePermissions } from "./utils.ts";

export const sync: HookHandler = {
  help: () => 'Add executable permissions to bin files.',
  dry,
  handler,
}

async function handler(props: HookProps) {
  if (Deno.build.os === 'windows') { return; }

  const binPath = getBinPath(props.target);
  if (!binPath) { return; }

  logger.debug(`Finding top files at ${binPath}.`);
  const files = await getFilesToSync(binPath);
  logger.debug(`Found ${files.length} files to add executable permissions.`);
  await setExecutablePermissions(files);
  logger.debug(`Added executable permissions to ${files.length} files.`);
}

async function dry(props: HookProps) {
  if (Deno.build.os === 'windows') { return; }

  const binPath = getBinPath(props.target);
  if (!binPath) { return; }

  logger.debug(`Finding top files at ${binPath}.`);
  const files = await getFilesToSync(binPath);
  logger.debug(`Found ${files.length} files to add executable permissions.`);

  if (files.length === 0) { return; }

  await write('Add executable permissions to files:\n', Deno.stdout);
  for (const file of files) {
    await write(`  ${file}`, Deno.stdout);
  }
}

async function getFilesToSync(binPath: string) {
  try {
    const dirContent = Deno.readDir(binPath);
    const files = [];

    for await (const entry of dirContent) {
      if (entry.isFile) {
        const fullpath = join(binPath, entry.name);
        files.push(fullpath);
      }
    }

    return files;
  } catch (err) {
    logger.error(`Could not read bin folder at ${binPath}. try running 'smx x init'.`, err);
    return [];
  }
}
