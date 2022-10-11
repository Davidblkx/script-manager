import { GitUnit } from './core/git.ts';
import { BinUnit } from './core/bin/__.ts';
import { Unit } from "./models.ts";
import { getConfig } from '../core/config.ts';
import { singleton } from '../utils/singleton.ts';
import type { RootCommand } from '../root-command/root.ts';

const manager = singleton(() => new UnitManager([]));

export function getUnitManager() {
  return manager.value;
}

export const CoreUnitList: Unit[] = [
  BinUnit,
  GitUnit,
];

export interface UnitStatus extends Unit {
  enabled: boolean;
  installed: boolean;
  type: 'core' | 'plugin';
}

export interface UnitFilter {
  type?: 'core' | 'plugin';
  enabled?: boolean;
  installed?: boolean;
  hook?: string;
}

export class UnitManager {
  #units: UnitStatus[] = [];

  constructor(units: UnitStatus[]) {
    this.#units = units;
  }

  public async init(root: RootCommand): Promise<void> {
    await this.loadCoreUnits(root);
  }

  public getUnits(filter: UnitFilter = {}): UnitStatus[] {
    let units = this.#units;

    if (filter.enabled !== undefined) {
      units = units.filter((unit) => unit.enabled === filter.enabled);
    }

    if (filter.installed !== undefined) {
      units = units.filter((unit) => unit.installed === filter.installed);
    }

    if (filter.type !== undefined) {
      units = units.filter((unit) => unit.type === filter.type);
    }

    if (filter.hook !== undefined) {
      const hook = filter.hook;
      units = units.filter(
        (unit) => Object.keys(unit.hooks)
          .includes(hook)
      );
    }

    return units;
  }

  public getUnitById(id: string): UnitStatus | undefined {
    return this.#units.find((unit) => unit.id === id);
  }

  public getUnitByName(name: string): UnitStatus | undefined {
    return this.#units.find((unit) => unit.name === name);
  }

  private async loadCoreUnits(root: RootCommand): Promise<void> {
    const cfg = getConfig();

    for (const unit of CoreUnitList) {
      const installed = !!cfg.units[unit.id];
      const enabled = !!cfg.units[unit.id]?.enabled;

      try {
        if (enabled && unit.init) {
          await unit.init(root);
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.#units.push({ ...unit, enabled, installed, type: 'core' });
      }
    }
  }
}
