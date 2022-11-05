import { LocalConfigFile } from "../config/local-config.ts";
import { GlobalConfigFile } from "../config/global-config.ts";
import { GlobalConfig, LocalConfig } from "../config/model.ts";
import { IConfigHandler } from '../config.ts';
import { SettingsConfig } from './config.ts';
import { ISettingsPiority, SettingsPriority } from "./priority.ts";
import { isOSValue, JsonSettings, JsonValue, SettingTarget, SettingUnit, SettingValue } from "./models.ts";
import { ISection, Section } from './section.ts';

export interface ISettingsManager {
  readonly priority: ISettingsPiority;
  readonly value: Readonly<Record<string, SettingUnit>>;

  get(key: string): SettingUnit;
  set(unit: SettingUnit): void;
  delete(unit: SettingUnit): void;

  section<T extends JsonSettings>(): ISection<T>;

  save(): Promise<void>;
}

export class SettingsManager implements ISettingsManager {
  #priority: ISettingsPiority;
  #targets: {
    global?: SettingsConfig<GlobalConfig>;
    local?: SettingsConfig<LocalConfig>;
    target?: SettingsConfig<LocalConfig>;
  } = {};
  #globalProxy?: Readonly<Record<string, SettingUnit>>;
  #section?: ISection;

  get priority(): ISettingsPiority {
    return this.#priority;
  }

  get value() {
    if (!this.#globalProxy) {
      this.#globalProxy = this.#buildProxy();
    }
    return this.#globalProxy;
  }

  constructor({
    target,
    priority = new SettingsPriority(),
    globalConfig,
    localConfig,
    configHandler,
  }: {
    target?: string;
    priority?: ISettingsPiority;
    configHandler?: IConfigHandler;
    globalConfig?: GlobalConfigFile;
    localConfig?: LocalConfigFile;
  }) {
    this.#priority = priority;

    const globalFile = globalConfig ?? configHandler?.globalFile;
    if (globalFile) {
      this.#targets.global = new SettingsConfig({ configFile: globalFile });
    }

    const localFile = localConfig ?? configHandler?.localFile;
    if (localFile) {
      this.#targets.local = new SettingsConfig({ configFile: localFile });
    }
    if (target && localFile) {
      this.#targets.local = new SettingsConfig({
        configFile: localFile,
        getObj: c => c.config.targets[target].settings,
      });
    }
  }

  section<T extends JsonSettings>(): ISection<T> {
    if (!this.#section) {
      this.#section = new Section(this);
    }
    return this.#section as ISection<T>;
  }

  get(key: string): SettingUnit {
    const unit: SettingUnit = {
      key,
      value: undefined,
      target: this.#priority.default,
      OS: 'none',
    };

    const [target, value] = this.#finValue(key);

    unit.target = target;

    if (isOSValue(value)) {
      const thisOS = Deno.build.os;
      unit.value = (thisOS in value) ? value[thisOS] : value.value;
      unit.OS = thisOS;
    } else {
      unit.value = value;
    }

    return unit;
  }

  set(unit: SettingUnit): void {
    const target = this.#targets[unit.target];
    if (!target) {
      throw new Error(`Config file for: '${unit.target}' not found`);
    }

    const current = target.get(unit.key);
    if (isOSValue(current)) {
      const cp = { ...current };
      const key = unit.OS === 'none' ? 'value' : unit.OS;
      cp[key] = unit.value as JsonValue;
      target.set(unit.key, cp);
    } else {
      target.set(unit.key, unit.value as JsonValue);
    }
  }

  delete(unit: SettingUnit): void {
    const target = this.#targets[unit.target];
    if (!target) {
      throw new Error(`Config file for: '${unit.target}' not found`);
    }

    target.del(unit.key);
  }

  async save(): Promise<void> {
    for (const t of this.#priority.order) {
      const toSave = this.#targets[t];
      if (toSave) {
        await toSave.save();
      }
    }
  }

  #finValue(key: string): [SettingTarget, Readonly<SettingValue>] {
    for (const t of this.#priority.order) {
      if (this.#hasValue(t, key)) {
        return [t, this.#getValue(t, key)];
      }
    }

    return [this.#priority.default, undefined];
  }

  #getValue(target: SettingTarget, key: string): Readonly<SettingValue> {
    if (this.#targets[target]) {
      return this.#targets[target]?.get(key);
    }
    return undefined;
  }

  #hasValue(target: SettingTarget, key: string): boolean {
    if (this.#targets[target]) {
      return !!this.#targets[target]?.has(key);
    }
    return false;
  }

  #buildProxy(): Readonly<Record<string, SettingUnit>> {
    return new Proxy({}, {
      get: (_, key) => {
        return this.get(key.toString());
      }
    });
  }
}
