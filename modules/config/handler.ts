import type {
  Config,
  IAsyncConfig,
  IConfigHandler,
  IFileConfig,
  IReader,
  IWriter,
} from './models.ts';
import type { ILoggerFactory, Logger } from '../logger/models.ts';
import { AsyncConfig, EnvironmentConfig } from './factory.ts';

/** Config handler, allow to read current config value and write */
export class ConfigHandler implements IConfigHandler {
  #readers: IReader[] = [];
  #writers: IWriter[] = [];
  #logger: Logger;

  constructor(logFactory: ILoggerFactory) {
    this.#logger = logFactory.get('config_handler');
  }

  /**
   * Register an handler to read/write config
   *
   * @param handler the handler to register
   * @param at position to insert the handler, 0 takes priority
   * @returns
   */
  register(handler: IReader | IWriter, at?: number) {
    if (isReader(handler)) {
      const atPos = at ?? this.#readers.length;
      this.#readers.splice(atPos, 0, handler);
      this.#logger.trace(
        `Registered config reader [${handler.name}] at position ${atPos}`,
      );
    }

    if (isWriter(handler)) {
      const atPos = at ?? this.#writers.length;
      this.#writers.splice(atPos, 0, handler);
      this.#logger.trace(
        `Registered config writer [${handler.name}] at position ${atPos}`,
      );
    }

    return this;
  }

  /**
   * Register an handler to read config from environment
   *
   * @param at position to insert the handler, 0 takes priority
   * @returns
   */
  async regiterEnvironment(at?: number) {
    if (this.#readers.some((r) => r instanceof EnvironmentConfig)) return this;

    const env = new EnvironmentConfig();
    await env.checkAvailability();

    return this.register(env, at);
  }

  /**
   * Register an handler to read/write config from/to a file
   *
   * @param cfg object with read/write functions
   * @returns
   */
  async registerAsyncConfig(cfg: IAsyncConfig) {
    if (this.#readers.some((r) => r.name === cfg.name)) return this;

    if (cfg.isAvailable) {
      const available = await cfg.isAvailable();
      if (!available) {
        this.#logger.trace(`Config file not available: ${cfg.name}`);
        return this;
      }
    }

    this.#logger.trace(`Registering config file: ${cfg.name}`);
    const data = cfg.initialData ? cfg.initialData : await cfg.read();
    const config = new AsyncConfig(cfg.name, data, cfg.write);
    return this.register(config, cfg.at);
  }

  async registerFileConfig(cfg: IFileConfig) {
    if (this.#readers.some((r) => r.name === cfg.name)) return this;

    const fileState = await cfg.file.state();
    if (fileState === 'directory') {
      this.#logger.trace(`Failed to load ${cfg.file.path}, it's a directory`);
      return this;
    } else if (fileState === 'missing' && !cfg.init) {
      this.#logger.trace(`Failed to load ${cfg.file.path}, file not found`);
      return this;
    }

    try {
      const file = await cfg.file.toFile();
      if (fileState === 'missing') {
        this.#logger.trace(`Creating config file: ${cfg.file.path}`);
        const data = cfg.initialData ?? {};
        await file.parent.ensure();
        await file.write(JSON.stringify(data, null, 2));
      }

      const data = JSON.parse(await file.read());
      const config = new AsyncConfig(cfg.name, data, async (value) => {
        await file.write(JSON.stringify(value, null, 2));
      }, cfg.canUse);
      this.#logger.trace(`Registering config file: ${cfg.name}`);
      return this.register(config, cfg.at);
    } catch (err) {
      this.#logger.error(`Failed to load config file: ${cfg.file.path}`, err);
    }

    return this;
  }

  read<T>(config: Config<T>, target = Deno.build.os, at?: string): T {
    const keys = [`${config.domain}.${config.key}`];
    if (target) {
      keys.unshift(`${config.domain}.${target}.${config.key}`);
    }

    this.#logger.trace(`Reading config: ${keys[0]}`);

    for (const key of keys) {
      const value = this.#read(key, at);
      if (value !== undefined) {
        const parsed = config.parser(value);
        if (parsed !== undefined) {
          this.#logger.trace(`Config found: ${key} = ${parsed}`);
          return parsed;
        }
      }
    }

    this.#logger.trace(`Config not found: ${keys[0]}`);
    return config.defaultValue;
  }

  async write<T>(
    config: Config<T>,
    value: T,
    target?: string,
    at?: string,
  ): Promise<void> {
    const key = target
      ? `${config.domain}.${target}.${config.key}`
      : `${config.domain}.${config.key}`;
    this.#logger.trace(`Writing config: ${key} = ${value}`);
    await this.#write(key, value, at);
  }

  #read(key: string, at?: string): unknown {
    const readers = at ? this.#readers.filter((r) => r.name === at) : this.#readers;

    for (const reader of readers) {
      if (!reader || !reader.isAvailable()) continue;
      const value = reader.read(key);
      if (value !== undefined) {
        return value;
      }
    }

    return undefined;
  }

  async #write(key: string, value: unknown, at?: string): Promise<void> {
    const writer = (
      at
        ? this.#writers.filter((w) => w.name === at && w.isAvailable())
        : this.#writers.filter((w) => w.isAvailable())
    )[0];

    if (!writer) {
      const errMessage = at ? `Writer [${at}] not found` : 'No writer registered';
      this.#logger.error(errMessage);
      return;
    }

    try {
      await writer.write(key, value);
    } catch (err) {
      this.#logger.error(`Error writing config: ${err.message}`);
    }
  }
}

function isReader(handler: IReader | IWriter): handler is IReader {
  return typeof (handler as IReader).read === 'function';
}

function isWriter(handler: IReader | IWriter): handler is IWriter {
  return typeof (handler as IWriter).write === 'function';
}
