import type { Config, IConfigHandler, IReader, IWriter, Target } from './models.ts';
import type { ILoggerFactory, Logger } from '../logger/models.ts';
import { EnvironmentConfig, FileConfig } from './factory.ts';

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
      this.#logger.trace(`Registered config reader [${handler.name}] at position ${atPos}`);
    }

    if (isWriter(handler)) {
      const atPos = at ?? this.#writers.length;
      this.#writers.splice(atPos, 0, handler);
      this.#logger.trace(`Registered config writer [${handler.name}] at position ${atPos}`);
    }

    return this;
  }

  /**
   * Register an handler to read config from environment
   *
   * @param at position to insert the handler, 0 takes priority
   * @returns
   */
  regiterEnvironment(at?: number) {
    if (this.#readers.some((r) => r instanceof EnvironmentConfig)) return this;

    return this.register(new EnvironmentConfig(), at);
  }

  /**
   * Register an handler to read/write config from/to a file
   *
   * @param name handler name, used to identify the handler in logs
   * @param path URL to the file
   * @param at position to insert the handler, 0 takes priority
   * @returns
   */
  registerFile(name: string, path: URL, at?: number) {
    if (this.#readers.some((r) => r instanceof FileConfig && r.name === name)) return this;

    this.#logger.trace(`Registering file config at: ${path}`);
    return this.register(new FileConfig(name, path), at);
  }

  read<T>(config: Config<T>, target: Target = Deno.build.os): T {
    const keys = [`${config.domain}.${config.key}`];
    if (target) {
      keys.unshift(`${config.domain}.${target}.${config.key}`);
    }

    this.#logger.trace(`Reading config: ${keys[0]}`);

    for (const key of keys) {
      const value = this.#read(key);
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

  write<T>(config: Config<T>, value: T, target?: Target): void {
    const key = target ? `${config.domain}.${target}.${config.key}` : `${config.domain}.${config.key}`;
    this.#logger.trace(`Writing config: ${key} = ${value}`);
    this.#write(key, value);
  }

  #read(key: string): unknown {
    for (const reader of this.#readers) {
      const value = reader.read(key);
      if (value !== undefined) {
        return value;
      }
    }

    return undefined;
  }

  #write(key: string, value: unknown): void {
    this.#writers[0]?.write(key, value);
  }
}

function isReader(handler: IReader | IWriter): handler is IReader {
  return typeof (handler as IReader).read === 'function';
}

function isWriter(handler: IReader | IWriter): handler is IWriter {
  return typeof (handler as IWriter).write === 'function';
}
