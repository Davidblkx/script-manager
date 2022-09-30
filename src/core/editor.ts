import { getConfig, setConfig, saveConfig } from './config.ts';
import { logger } from '../logger.ts';

export const TARGET_NAME = '_TARGET_';

export async function setEditor(...args: string[]) {
  if (args.length === 0) {
    logger.error('No editor provided');
    return;
  }

  if (!args.find(e => e === TARGET_NAME)) {
    logger.warning(`Editor command must contain ${TARGET_NAME} as a placeholder for the file to edit`);
    logger.warning(`${TARGET_NAME} will be appended to the end of the command`);
    args.push(TARGET_NAME);
  }

  const config = getConfig();
  config.editor = args;
  setConfig(config);

  await saveConfig();
}

export function getEditor(): string {
  const config = getConfig();
  return config.editor.join(' ').replace(TARGET_NAME, '<PATH TO FILE>');
}
