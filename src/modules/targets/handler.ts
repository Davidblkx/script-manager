import { join } from 'deno/path/mod.ts';

import type { IConfigHandler } from "../config.ts";
import type { ISettingsManager } from "../settings/models.ts";

import { logger } from '../logger.ts';
import { ITarget, ITargetHandler } from "./models.ts";
import { Target } from './target.ts';
import { IDirHandlerFactory } from "../infra/dir-handler.ts";
import { removeInvalidPathChars } from '../utils/file.ts';

export class TargetHandler implements ITargetHandler {
  #configHandler: IConfigHandler;
  #settingsManager: ISettingsManager;
  #dirHandlerFactory: IDirHandlerFactory;

  constructor(
    configHandler: IConfigHandler,
    settings: ISettingsManager,
    dirHandlerFactory: IDirHandlerFactory
  ) {
    this.#configHandler = configHandler;
    this.#settingsManager = settings;
    this.#dirHandlerFactory = dirHandlerFactory;
  }

  public async get(id: string): Promise<ITarget | undefined> {
    const localFile = this.#configHandler.localFile;
    if (!localFile) {
      logger.error('Local config file not found');
      Deno.exit(1);
    }

    const config = localFile.config.targets[id];
    if (!config) {
      logger.debug(`Target ${id} not found`);
      return undefined;
    }

    const rootPath = this.#configHandler.globalFile?.config.path;
    if (!rootPath) {
      logger.error('Config file not loaded');
      Deno.exit(1);
    }

    const save = () => localFile.save();

    const targetFolder = join(rootPath, id);
    const dirHandler = await this.#dirHandlerFactory(targetFolder);
    await dirHandler.load();

    return new Target(this.#settingsManager, config, dirHandler, save);
  }

  public async create(name: string, id?: string, setDefault = false): Promise<ITarget> {
    const newId = id ?? removeInvalidPathChars(name).toLowerCase();

    const exists = !!(await this.get(newId));

    if (exists) {
      logger.error(`Target ${newId} already exists`);
      Deno.exit(1);
    }

    const localFile = this.#configHandler.localFile;
    if (!localFile) {
      logger.error('Config file not loaded');
      Deno.exit(1);
    }

    localFile.config.targets[newId] = {
      id: newId,
      name,
      settings: {},
    };
    await localFile.save();

    const target = await this.get(newId);
    if (!target) {
      logger.error(`Failed to create target ${newId}`);
      Deno.exit(1);
    }

    await target.init(setDefault);
    return target;
  }

  public async delete(id: string): Promise<void> {
    const localFile = this.#configHandler.localFile;
    if (!localFile) {
      logger.error('Config file not loaded');
      Deno.exit(1);
    }

    const target = await this.get(id);
    if (!target) {
      logger.error(`Target ${id} not found`);
      Deno.exit(1);
    }

    await target.delete();
    delete localFile.config.targets[id];
    await localFile.save();
  }

  public async current(): Promise<ITarget> {
    const id = this.#settingsManager.targetId;
    if (!id) {
      logger.error('No target selected');
      Deno.exit(1);
    }

    const target = await this.get(id);
    if (!target) {
      logger.error(`Target ${id} not found`);
      Deno.exit(1);
    }

    return target;
  }
}
