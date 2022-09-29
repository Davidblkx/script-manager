// Module to manage the configuration file and related directories

import { ensureDir } from 'deno/fs/mod.ts';
import { join } from 'deno/path/mod.ts';

import { defaultConfig } from './defaults.ts';
import { SMXConfig } from './models.ts';
import { logger } from '../logger.ts';
import { getFileInfo } from '../utils/file.ts';

/** Name of config file */
const FILE_NAME = '.smx.json';
/** Current config in memory */
let _config: SMXConfig = defaultConfig;
/** Defines if current config was loaded from a file */
let _loadedFromFile = false;
/** Current config folder */
let _folder: string | undefined;

/** Get current config folder */
export function getConfigPath(): string {
  if (!_folder) { return "NOT_DEFINED"; }
  return join(_folder, FILE_NAME);
}

/** Get current config */
export function getConfig(): SMXConfig {
  return _config;
}

/** Set current config */
export function setConfig(config: SMXConfig): void {
  _config = {
    ...defaultConfig,
    ...config,
  }
}

export function loadConfigFromHome() {
  return loadConfig(getHomeDirectory());
}

/**
 * Load config and update current config file
 * Properties are merged with default config
 *
 * If no config file is found, a new one is created
 *
 * If no folder is provided, returns current config in memory
 * Must be called with a valid folder at least once
 *
 * @param folder Folder to load config from
 * @param force Force to load config from file
 * @returns Config object
*/
export async function loadConfig(folder?: string, force = false): Promise<SMXConfig> {
  if (folder) {
    _folder = folder;
  }

  if (_loadedFromFile && !force) {
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

/**
 * Save current config to file
 *
 * If no folder is provided, uses last folder used
 *
 * @param folder Folder to save config to
 */
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

  _loadedFromFile = true;
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
  const info = await getFileInfo(file);

  if (!info) return undefined;

  if (info.isFile) {
    logger.debug(`Reading config file from: ${file}`);
    return await Deno.readTextFile(file);
  }

  throw new Error('Config file is not a valid file: ' + file);
}

async function ensureConfigPath(folder: string): Promise<string> {
  await ensureDir(folder);
  return join(folder, FILE_NAME);
}

export function getHomeDirectory() {
  return Deno.env.get('HOME') || Deno.env.get('USERPROFILE') || Deno.env.get('HOMEPATH') || '~';
}
