import { BaseConfig } from './model.ts';
import { IFileHandlerFactory, IFileHandler, FileHandler } from '../infra/file-handler.ts';
import { logger } from '../logger.ts';

export interface ConfigFileOptions<T extends BaseConfig> {
  path: [string, 'file' | 'folder'];
  initialConfig: T;
  fileFactory?: IFileHandlerFactory;
}

export class ConfigFile<T extends BaseConfig> {
  #fileHandler: IFileHandler;
  #initialConfig: T;
  #config: T;
  #hasInit = false;

  constructor(options: ConfigFileOptions<T>) {
    this.#config = this.#initialConfig = options.initialConfig;
    this.#fileHandler = options.fileFactory
      ? options.fileFactory(options.path[0], options.path[1])
      : new FileHandler(options.path[0], options.path[1]);
  }

  public async init(): Promise<void> {
    if (this.#hasInit) {
      logger.debug(`Config file '${this.#fileHandler.path}' already initialized!`);
      return;
    }
    this.#hasInit = true;

    logger.debug(`Initializing config file '${this.#fileHandler.path}'`);
    const configValue = await this.#fileHandler.readJsonFile<T>(this.#initialConfig) ?? {};

    const updatedValue: T = {
      ...this.#initialConfig,
      ...configValue,
      settings: {
        ...this.#initialConfig.settings,
        ...(configValue.settings ?? {}),
      }
    }

    if ('version' in updatedValue && updatedValue.version !== this.#initialConfig.version) {
      logger.warning(`Config file '${this.#fileHandler.path}' version mismatch, updating...`);
      // TODO: add logic to update config file version
      updatedValue.version = this.#initialConfig.version;
    }

    this.#config = updatedValue;

    logger.debug(`Update config file '${this.#fileHandler.path}'`);
    await this.#fileHandler.writeJsonFile<T>(updatedValue);
  }

  public async save(): Promise<void> {
    logger.debug(`Saving config file ${this.#fileHandler.path}`);
    await this.#fileHandler.writeJsonFile<T>(this.#config);
  }

  public async reload(): Promise<void> {
    logger.debug(`Reloading config file ${this.#fileHandler.path}`);
    const configValue = await this.#fileHandler.readJsonFile<T>(this.#initialConfig);
    this.#config = configValue;
  }

  public get config(): T {
    return this.#config;
  }

  public setConfig(config: T): Promise<void> {
    this.#config = config;
    return this.save();
  }

  public get path(): string {
    return this.#fileHandler.path;
  }
}
