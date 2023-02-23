/** Target platform for a config entry */
export type Target = 'windows' | 'darwin' | 'linux';

/** Config value parser */
export type Parser<T> = (value: unknown) => T | undefined;

/** Config entry */
export type Config<T> = {
  key: string;
  domain: string;
  defaultValue: T;
  parser: Parser<T>;
}

/** Config reader */
export interface IReader {
  readonly name: string;
  read(key: string): unknown;
}

/** Config writer */
export interface IWriter {
  readonly name: string;
  write(key: string, value: unknown): void;
}

/** Config handler, allow to read current config value */
export interface IConfigHandler {
  /**
   * Read the value for a config entry
   *
   * @param config config entry
   * @param target default to current platform
   */
  read<T>(config: Config<T>, target?: Target): T;

  /**
   * Write the value for a config entry
   *
   * @param config config entry
   * @param value value to write
   * @param target default to empty
   */
  write<T>(config: Config<T>, value: T, target?: Target): void;
}

/** Config provider, allow to declare config entries */
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

/** Handle read/write to disk */
export interface IFileHandler {
  read(path: URL): string;
  write(path: URL, content: string): void;
}
