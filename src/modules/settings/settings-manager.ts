import type { IConfigHandler } from "../config/config-handler.ts";
import { GlobalConfig, LocalConfig, SettingsObject, SettingValue } from "../config/model.ts";
import { ISettingsManager, SettingTarget, ISettingsValidation } from "./models.ts";
import { logger } from '../logger.ts';
import { ConfigFile } from "../config/config-file.ts";

export class SettingsManager implements ISettingsManager {
  #configHandler?: IConfigHandler;
  #globalConfig?: ConfigFile<GlobalConfig>;
  #localConfig?: ConfigFile<LocalConfig>
  #validator: ISettingsValidation;
  #targetId?: string;

  get #globalConfigFile() {
    return this.#globalConfig ?? this.#configHandler?.globalFile;
  }

  get #localConfigFile() {
    return this.#localConfig ?? this.#configHandler?.localFile;
  }

  get #currentTargetId() {
    return this.#targetId ?? this.#configHandler?.targetId;
  }

  get validator(): ISettingsValidation {
    return this.#validator;
  }

  constructor({
    configHandler,
    validator,
    globalConfig,
    localConfig,
    targetId,
  }: {
    validator: ISettingsValidation,
    configHandler?: IConfigHandler,
    globalConfig?: ConfigFile<GlobalConfig>,
    localConfig?: ConfigFile<LocalConfig>,
    targetId?: string,
  }) {
    this.#validator = validator;
    this.#configHandler = configHandler;
    this.#globalConfig = globalConfig;
    this.#localConfig = localConfig;
    this.#targetId = targetId;
  }

  getSetting(key: string): SettingValue;
  getSetting(key: string, target: SettingTarget): SettingValue;
  getSetting(key: string, target: 'target', targetId: string): SettingValue
  getSetting(key: string, target?: SettingTarget, targetId?: string): SettingValue {
    const settings = this.#getSettings(target, targetId);
    if (!settings) { return undefined; }
    return settings[key];
  }

  async setSetting(key: string, value: SettingValue): Promise<boolean>
  async setSetting(key: string, value: SettingValue, target: SettingTarget): Promise<boolean>
  async setSetting(key: string, value: SettingValue, target: 'target', targetId: string): Promise<boolean>
  async setSetting(key: string, value: SettingValue, target?: SettingTarget, targetId?: string): Promise<boolean> {
    const settings = this.#getSettings(target, targetId);

    if (!settings) { return false; }

    const [valid] = this.#validator.validateSetting(key, value);
    if (!valid) { return false; }

    settings[key] = value;

    if (target === 'global') {
      await this.#globalConfigFile?.save();
    } else {
      await this.#localConfigFile?.save();
    }

    return true;
  }

  async deleteSetting(key: string): Promise<boolean>
  async deleteSetting(key: string, target: SettingTarget): Promise<boolean>
  async deleteSetting(key: string, target: 'target', targetId: string): Promise<boolean>
  async deleteSetting(key: string, target?: SettingTarget, targetId?: string): Promise<boolean> {
    const settings = this.#getSettings(target, targetId);

    if (!settings) { return false; }
    delete settings[key];

    if (target === 'global') {
      await this.#globalConfigFile?.save();
    } else {
      await this.#localConfigFile?.save();
    }

    return true;
  }

  #getSettings(target?: SettingTarget, targetId?: string): SettingsObject | undefined {
    if (!target) {
      return this.#getTargetSettings(targetId)
        ?? this.#getLocalSettings()
        ?? this.#getGlobalSettings();
    }

    switch (target) {
      case 'global': return this.#getGlobalSettings();
      case 'local': return this.#getLocalSettings();
      case 'target': return this.#getTargetSettings(targetId);
    }
  }

  #getGlobalSettings(): SettingsObject | undefined {
    const globalFile = this.#globalConfigFile;
    if (!globalFile) {
      logger.debug("No global file loaded");
      return undefined;
    }
    return globalFile.config.settings;
  }

  #getLocalSettings(): SettingsObject | undefined {
    const localFile = this.#localConfigFile;
    if (!localFile) {
      logger.debug("No local file loaded");
      return undefined;
    }
    return localFile.config.settings;
  }

  #getTargetSettings(id?: string): SettingsObject | undefined {
    const targetId = id ?? this.#currentTargetId;
    if (!targetId) {
      logger.debug("No targetId set");
      return undefined;
    }
    const localFile = this.#localConfigFile;
    if (!localFile) {
      logger.debug("No local file loaded");
      return undefined;
    }
    const target = localFile.config.targets[targetId];
    if (!target) {
      logger.debug(`No target found with id ${targetId}`);
      return undefined;
    }
    return target.settings;
  }
}
