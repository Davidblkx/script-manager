import { IEntry } from '../file-system/model.ts';

/** Config value parser */
export type Parser<T> = (value: unknown) => T | undefined;

/** Config entry */
export type Config<T> = {
  key: string;
  domain: string;
  defaultValue: T;
  parser: Parser<T>;
  description?: string;
};

export interface IHandler {
  readonly name: string;

  isAvailable(): boolean;
}

/** Config reader */
export interface IReader extends IHandler {
  read(key: string): unknown;
}

/** Config writer */
export interface IWriter extends IHandler {
  write(key: string, value: unknown): void | Promise<void>;
}

export interface IAsyncConfig {
  readonly name: string;
  read: () => Promise<Record<string, unknown>>;
  write: (data: Record<string, unknown>) => Promise<void>;
  isAvailable?: () => boolean | Promise<boolean>;
  readonly initialData?: Record<string, unknown>;
  readonly at?: number;
}

export interface IFileConfig {
  name: string;
  file: IEntry;
  at?: number;
  initialData?: Record<string, unknown>;
  init?: boolean;
  canUse?: () => boolean;
}

/** Config handler, allow to read/write current config value */
export interface IConfigHandler {
  /**
   * Register an handler to read/write config
   *
   * @param handler the handler to register
   * @param at position to insert the handler, 0 takes priority
   * @returns
   */
  register(handler: IReader | IWriter, at?: number): IConfigHandler;

  /**
   * Register an handler to read config from environment
   *
   * @param at position to insert the handler, 0 takes priority
   * @returns
   */
  regiterEnvironment(at?: number): Promise<IConfigHandler>;

  /**
   * Register an handler to read/write config from/to a file
   *
   * @param config object with read/write functions
   * @returns
   */
  registerAsyncConfig(config: IAsyncConfig): Promise<IConfigHandler>;

  /**
   * Register an handler to read/write config from/to a JSON file
   *
   * @param config object with file details
   */
  registerFileConfig(config: IFileConfig): Promise<IConfigHandler>;

  /**
   * Read the value for a config entry
   *
   * @param config config entry
   * @param target default to current platform
   * @param at reader name to use
   */
  read<T>(config: Config<T>, target?: string, at?: string): T;

  /**
   * Write the value for a config entry
   *
   * @param config config entry
   * @param value value to write
   * @param target default to empty
   * @param at writer name to use
   */
  write<T>(
    config: Config<T>,
    value: T,
    target?: string,
    at?: string,
  ): Promise<void>;
}

/**
 * Config provider, allow to declare config entries. Which can be used to identify possible configs
 */
export interface IConfigProvider {
  /**
   * Declare a config entry
   *
   * @param config config entry
   */
  declare<T>(config: Config<T>): void;

  /**
   * Search for a config entry
   *
   * @param key
   * @param domain
   */
  search<T>(key: string, domain?: string): Config<T> | undefined;

  /**
   * Search for all config entries in a domain
   *
   * @param domain
   */
  domain(domain: string): Config<unknown>[];
}
