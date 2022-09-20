import { move } from 'deno/fs/mod.ts';

import { getConfig, setConfig, saveConfig } from './config.ts';
import { logger } from '../logger.ts';

export async function setFolder(folder: string, move = false) {
  const config = getConfig();

  if (move) { moveFolder(config.folder, folder); }

  config.folder = folder;
  setConfig(config);

  await saveConfig();

  logger.debug(`Set folder to: ${folder}`);
}

function moveFolder(src: string, des: string) {
  try {
    logger.debug(`Moving folder from ${src} to ${des}`);
    return move(src, des, { overwrite: true });
  } catch (e) {
    logger.error(`Failed to move folder from ${src} to ${des}`);
    throw e;
  }
}
