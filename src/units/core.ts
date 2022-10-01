import { logger } from '../logger.ts';
import { getConfig, setConfig, saveConfig } from '../core/config.ts';

import type { Unit } from './models.ts';

import { GitUnit } from './core/git.ts';
import { BinUnit } from './core/bin.ts';

export const CoreUnitList: Unit[] = [
  BinUnit,
  GitUnit,
];

export function getAvailableUnits() {
  const list:(Unit & { enabled: boolean, installed: boolean })[] = [];
  const cfg = getConfig();

  for (const unit of CoreUnitList) {
    const installed = !!cfg.units[unit.id];
    const enabled = !!cfg.units[unit.id]?.enabled;
    list.push({ ...unit, enabled, installed });
  }

  return list;
}

export async function installUnit(id: string, enabled = true): Promise<void> {
  const units = getAvailableUnits();
  const cfg = getConfig();
  const unit = units.find((u) => u.id === id);
  if (!unit) {
    logger.error(`Unit ${id} not found`);
    return;
  }

  if (cfg.units[id]) {
    logger.error(`Unit ${id} already installed`);
    return;
  }

  logger.debug(`Installing unit: ${id}`);

  cfg.units[id] = {
    id,
    enabled,
    type: 'core',
    settings: {},
  };

  setConfig(cfg);
  await saveConfig();

  logger.debug(`Unit ${id} installed`);
}

export async function setEnableStatus(id: string, enabled: boolean): Promise<void> {
  const cfg = getConfig();
  if (!cfg.units[id]) {
    logger.error(`Unit ${id} not installed`);
    return;
  }

  cfg.units[id].enabled = enabled;
  setConfig(cfg);
  await saveConfig();
}

export async function setSetting(id: string, key: string, value: string | undefined): Promise<void> {
  const cfg = getConfig();
  if (!cfg.units[id]) {
    logger.error(`Unit ${id} not installed`);
    return;
  }

  if (value) {
    logger.debug(`Setting ${id} ${key} to ${value}`);
    cfg.units[id].settings[key] = value;
  } else {
    logger.debug(`Removing ${id} ${key}`);
    delete cfg.units[id].settings[key];
  }

  setConfig(cfg);
  await saveConfig();
}

export function getSetting(id: string, key: string): string | undefined {
  const cfg = getConfig();
  if (!cfg.units[id]) {
    logger.error(`Unit ${id} not installed`);
    return undefined;
  }

  return cfg.units[id].settings[key];
}
