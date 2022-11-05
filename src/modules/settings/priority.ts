import { SettingTarget, TargetOrder } from "./models.ts";

export interface ISettingsPiority {
  readonly order: TargetOrder;
  readonly default: SettingTarget;

  setOrder(order: TargetOrder): void;
  setDefault(target: SettingTarget): void;
}

export class SettingsPriority implements ISettingsPiority {
  #order: TargetOrder = ['global', 'local', 'target'];
  #default: SettingTarget = 'global';

  get order(): TargetOrder {
    return this.#order;
  }

  get default(): SettingTarget {
    return this.#default;
  }

  setOrder(order: TargetOrder): void {
    this.#order = order;
  }

  setDefault(target: SettingTarget): void {
    this.#default = target;
  }
}
