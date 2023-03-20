/** Config value parser */
export type Parser<T> = (value: unknown) => T | undefined;

/** Config entry */
export type Config<T> = {
  key: string;
  domain: string;
  defaultValue: T;
  parser: Parser<T>;
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

/** Config handler, allow to read/write current config value */
export interface IConfigHandler {
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
    at?: string
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
