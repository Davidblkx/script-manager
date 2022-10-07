import { GitUnit } from './core/git.ts';
import { BinUnit } from './core/bin/__.ts';
import { Unit } from "./models.ts";
import { getConfig } from '../core/config.ts';
import { singleton } from '../utils/singleton.ts';

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
    this.loadCoreUnits();
  }

  public async loadPluginUnits(): Promise<void> {
    // TODO: load plugin units
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

  private loadCoreUnits(): void {
    const cfg = getConfig();

    for (const unit of CoreUnitList) {
      const installed = !!cfg.units[unit.id];
      const enabled = !!cfg.units[unit.id]?.enabled;
      this.#units.push({ ...unit, enabled, installed, type: 'core' });
    }
  }
}
