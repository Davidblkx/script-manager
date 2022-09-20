import { ensureDir } from 'deno/fs/mod.ts';
import { join } from 'deno/path/mod.ts';

import { defaultConfig } from './defaults.ts';
import { SMXConfig } from './models.ts';
import { logger } from '../logger.ts';

const FILE_NAME = '.smx.json';

let _config: SMXConfig = defaultConfig;
let _fromFile = false;
let _folder: string | undefined;

export function getConfigPath(): string {
  if (!_folder) { return "NOT_DEFINED"; }
  return join(_folder, FILE_NAME);
}

export function getConfig(): SMXConfig {
  return _config;
}

export function setConfig(config: SMXConfig): void {
  _config = {
    ...defaultConfig,
    ...config,
  }
}

export async function loadConfig(folder?: string, force = false): Promise<SMXConfig> {
  if (folder) {
    _folder = folder;
  }

  if (_fromFile && !force) {
    logger.debug('Loading config from memory');
    return _config;
  }

  try {
    if (!_folder) { throw new Error('No folder provided'); }
    return await readAndUpdateConfig(_folder);
  } catch (e) {
    logger.error('Error loading config', e);
    logger.debug('Loading default config');
    return _config;
  }
}

export async function saveConfig(folder?: string): Promise<void> {
  const saveFolder = folder || _folder;
  if (!saveFolder) {
    logger.error('Cannot save config, no folder provided');
    return;
  }
  const path = await ensureConfigPath(saveFolder);
  logger.debug(`Saving config to: ${path}`);
  await Deno.writeTextFile(path, JSON.stringify(_config, null, 2));
}

async function readAndUpdateConfig(folder: string): Promise<SMXConfig> {
  const path = await ensureConfigPath(folder);
  const config = await readConfig(path, defaultConfig);

  await Deno.writeTextFile(path, JSON.stringify(config, null, 2));
  setConfig(config);

  _fromFile = true;
  return config;
}

async function readConfig(path: string, defaults: SMXConfig): Promise<SMXConfig> {
  const content = await readFile(path);
  const config = parseConfig(content);
  return {
    ...defaults,
    ...config,
  }
}

function parseConfig(content: string | undefined): Partial<SMXConfig> {
  try {
    return JSON.parse(content || '{}');
  } catch (e) {
    logger.debug('Error parsing config file', e);
    return {};
  }
}

async function readFile(file: string): Promise<string | undefined> {
  const info = await Deno.stat(file);

  if (info.isFile) {
    logger.debug(`Reading config file from: ${file}`);
    return await Deno.readTextFile(file);
  }

  logger.debug(`Config file not found: ${file}`);
  return undefined;
}

async function ensureConfigPath(folder: string): Promise<string> {
  await ensureDir(folder);
  return join(folder, FILE_NAME);
}
