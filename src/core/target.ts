import { join } from 'deno/path/mod.ts';
import { ensureDir } from 'deno/fs/mod.ts';

import { TargetConfig } from './models.ts';
import { getConfig, saveConfig, setConfig } from './config.ts';
import { logger } from '../logger.ts';

export async function createTarget(name: string, isDefault = false): Promise<TargetConfig | undefined> {
  const cfg = getConfig();
  let id = createId(name);
  if (cfg.targets[id]) { id = crypto.randomUUID(); }

  logger.debug(`Creating target ${name} with id ${id}`);

  if (cfg.targets[id]) {
    logger.error(`Target ${name} already exists`);
    return undefined;
  }

  const target: TargetConfig = { id, name, settings: {} };
  cfg.targets[id] = target;

  if (isDefault) {
    logger.debug(`Setting default target to ${name}`);
    cfg.default = id;
  }

  await init(target);

  setConfig(cfg);
  await saveConfig();

  logger.info(`Created target ${name}`);

  return target;
}

export function getTargetById(id?: string): TargetConfig | undefined {
  const cfg = getConfig();
  if (!id) { id = cfg.default; }

  return cfg.targets[id];
}

export function getTargetByName(name: string): TargetConfig | undefined {
  const cfg = getConfig();
  return Object.values(cfg.targets).find((t) => t.name === name);
}

export function buildTargetPath(target: TargetConfig) {
  const cfg = getConfig();
  return join(cfg.folder, target.id);
}

export async function setName(target: TargetConfig, name: string) {
  const cfg = getConfig();
  target.name = name;
  cfg.targets[target.id] = target;
  setConfig(cfg);
  await saveConfig();
  logger.debug(`Renamed target ${target.id} to ${name}`);
}

export async function setDefault(target: TargetConfig) {
  const cfg = getConfig();
  cfg.default = target.id;
  setConfig(cfg);
  await saveConfig();
  logger.debug(`Set default target to ${target.name}`);
}

export async function deleteTarget(target: TargetConfig) {
  const cfg = getConfig();

  if (cfg.default === target.id) {
    logger.error('Cannot delete default target');
    return;
  }

  delete cfg.targets[target.id];
  setConfig(cfg);
  await saveConfig();
  logger.debug(`Deleted target ${target.name}`);
}

export async function setSetting(target: TargetConfig, key: string, value: string | undefined) {
  const cfg = getConfig();
  if (value) {
    target.settings[key] = value;
    logger.debug(`Set setting ${key} to ${value} for target ${target.name}`);
  } else {
    delete target.settings[key];
    logger.debug(`Deleted setting ${key} for target ${target.name}`);
  }
  cfg.targets[target.id] = target;
  setConfig(cfg);
  await saveConfig();
  logger.debug(`Settings for target ${target.name} saved`);
}

export async function init(target: TargetConfig) {
  const path = buildTargetPath(target);
  logger.debug(`Creating target folder ${path}`);
  await ensureDir(path);
  logger.debug(`Created target folder ${path}`);
}

function createId(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}
