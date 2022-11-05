import { BaseConfig, SettingsObject } from "../config.ts";
import { ConfigFile } from "../config/config-file.ts";
import { SettingValue } from "./models.ts";

export class SettingsConfig<T extends BaseConfig> {
  #handler: ConfigFile<T>;
  #getObj: (config: ConfigFile<T>) => SettingsObject;
  #changes = false;

  constructor({
    configFile,
    getObj = (config: ConfigFile<T>) => config.config.settings
  }: {
    configFile: ConfigFile<T>;
    getObj?: (config: ConfigFile<T>) => SettingsObject
  }) {
    this.#handler = configFile;
    this.#getObj = getObj;
  }

  get global(): Readonly<Record<string, SettingValue>> {
    return this.#getObj(this.#handler);
  }

  get(key: string): Readonly<SettingValue> {
    return this.global[key];
  }

  set(key: string, value: SettingValue): void {
    this.#getObj(this.#handler)[key] = value;
    this.#changes = true;
  }

  del(key: string): void {
    delete this.#getObj(this.#handler)[key];
    this.#changes = true;
  }

  has(key: string): boolean {
    return key in this.global;
  }

  async save() {
    if (!this.#changes) { return false; }
    await this.#handler.save();
    this.#changes = false;
    return true;
  }
}
