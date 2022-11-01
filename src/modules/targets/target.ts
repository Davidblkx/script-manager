import type { TargetConfig } from "../config.ts";
import type { ISettingsManager } from "../settings/models.ts";
import type { IDirHandler } from '../infra/dir-handler.ts';

import { getSettingsObj, settingKeys } from "../settings/settings-names.ts";
import { logger } from '../logger.ts';

import { ITarget } from "./models.ts";

export class Target implements ITarget {
  #settings: ISettingsManager;
  #target: TargetConfig;
  #dirHandler: IDirHandler;
  #save: () => Promise<void>;

  constructor(
    settings: ISettingsManager,
    target: TargetConfig,
    dirHandler: IDirHandler,
    save: () => Promise<void>,
  ) {
    this.#settings = settings;
    this.#target = target;
    this.#dirHandler = dirHandler;
    this.#save = save;
  }

  public get id() {
    return this.#target.id;
  }

  public get isDefault() {
    return this.#target.id === getSettingsObj(this.#settings).targets.default;
  }

  public get name() {
    return this.#target.name;
  }

  public get initialized() {
    return this.#dirHandler.exists;
  }

  public get path() {
    return this.#dirHandler.path;
  }

  public async init(setDefault: boolean): Promise<void> {
    logger.debug(`Initializing target ${this.#target.id}`);
    await this.#dirHandler.create();

    if (setDefault) {
      await this.setDefault();
    }
  }

  public async reset(type: 'all' | 'settings' | 'content'): Promise<void> {
    if (type === 'all' || type === 'settings') {
      logger.debug(`Deleting settings for target ${this.#target.id}`);
      this.#target.settings = {};
      await this.#save();
    }

    if (type === 'all' || type === 'content') {
      logger.debug(`Deleting content for target ${this.#target.id}`);
      await this.#dirHandler.empty();
    }
  }

  public async setDefault(): Promise<void> {
    logger.debug(`Setting target ${this.#target.id} as default`);
    await this.#settings.setSetting(settingKeys.targets.default, this.#target.id, 'local');
  }

  public async delete(): Promise<void> {
    await this.#dirHandler.delete();
  }

  public async setName(value: string): Promise<void> {
    logger.debug(`Setting name for target ${this.#target.id}: ${value}`);
    this.#target.name = value;
    await this.#save();
  }
}
