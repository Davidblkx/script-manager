import type { Logger } from '../../../modules/logger/mod.ts';
import type { IAsyncConfig } from '../../../modules/config/mod.ts';
import type { IServices } from '../../../modules/services.ts';
import type { IFile } from '../../../modules/file-system/model.ts';
import type { ScriptManagerConfig } from './models.ts';

export class ConfigFile implements IAsyncConfig {
  #file: IFile;
  #logger: Logger;
  #name: string;
  #lasValue: ScriptManagerConfig;
  #init = false;
  #at?: number;

  get name(): string {
    return this.#name;
  }

  get initialData(): Record<string, unknown> {
    return this.#lasValue.settings;
  }

  get value(): ScriptManagerConfig {
    return this.#lasValue;
  }

  get at(): number | undefined {
    return this.#at;
  }

  get path() {
    return this.#file.path;
  }

  get pathName() {
    return this.#file.path.pathname;
  }

  constructor(services: IServices, name: string, file: IFile) {
    this.#file = file;
    this.#logger = services
      .get('logger')
      .get(`config-file:${file.path.pathname}`);
    this.#name = name;
    this.#lasValue = {
      settings: {},
      version: '0.5.0',
    };
  }

  setIndex(index: number): this {
    this.#logger.trace(`Set index to ${index}`);
    this.#at = index;
    return this;
  }

  updateValue(
    value:
      | ScriptManagerConfig
      | ((e: ScriptManagerConfig) => ScriptManagerConfig),
  ): this {
    this.#lasValue = typeof value === 'function' ? value(this.#lasValue) : value;
    return this;
  }

  isAvailable() {
    return this.#init;
  }

  async init(ensureFile = false): Promise<boolean> {
    this.#init = true;

    const state = await this.#file.state();
    if (state === 'missing' && ensureFile) {
      this.#logger.trace(`File is missing, creating it`);
      await this.writeFileConfig(this.#lasValue);
    } else if (state === 'missing') {
      this.#logger.trace(`File is missing, skiping`);
      this.#init = false;
      return false;
    }

    this.#lasValue = await this.readFileConfig();
    this.#logger.trace(`Initiated`);
    return this.#init;
  }

  async read() {
    if (!this.#init) {
      await this.init();
    }
    const value = await this.readFileConfig();
    return value.settings;
  }

  async write(data: Record<string, unknown>) {
    if (!this.#init) {
      await this.init();
    }
    const value = await this.readFileConfig();
    value.settings = data;
    await this.writeFileConfig(value);
  }

  async readFileConfig() {
    const content = await this.#file.read();
    const config = JSON.parse(content) as ScriptManagerConfig;

    this.#lasValue = config;

    // TODO: write a function to compare version and update config

    return config;
  }

  async writeFileConfig(config?: ScriptManagerConfig) {
    const toWrite = config ?? this.#lasValue;
    const content = JSON.stringify(toWrite, null, 2);
    await this.#file.parent.ensure();
    await this.#file.write(content);
  }

  static async create(
    services: IServices,
    name: string,
    path: string | URL,
    initFile?: Partial<ScriptManagerConfig>,
  ) {
    const fs = services.get('file-system');
    const logger = services.get('logger').get('init.config-file');

    const entry = fs.get(path);
    const state = await entry.state();
    if (state === 'directory') {
      logger.error(`Path ${entry.path.pathname} is a directory, skiping`);
      return;
    }

    const file = await entry.toFile();
    const config = new ConfigFile(services, name, file);
    if (typeof initFile === 'object') {
      await config
        .updateValue((v) => ({
          ...v,
          ...initFile,
        }))
        .init(true);
    } else {
      await config.init(false);
    }

    return config;
  }
}
