import { ensureDir } from 'deno/fs/ensure_dir.ts';
import { join } from 'deno/path/mod.ts';
import { logger } from '../logger.ts';
import { getFileInfo } from '../utils/file.ts';

export const CONFIG_FILE_NAME = '.smx.json';

export type IFileHandlerFactory = (path: string) => IFileHandler;

export interface IFileHandler {
  readonly path: string;
  readTextFile(): Promise<string>
  readTextFile(defaultValue: string): Promise<string>;
  writeTextFile(content: string): Promise<boolean>;
  readJsonFile<T>(defaultValue: T): Promise<T>
  writeJsonFile<T>(content: T): Promise<boolean>;
}

export class FileHandler implements IFileHandler {
  protected _path: string;
  protected _folder: string;

  public get path(): string {
    return this._path;
  }

  constructor(folder: string) {
    this._folder = folder;
    this._path = join(folder, CONFIG_FILE_NAME);
  }

  public async readTextFile(defaultValue = ''): Promise<string> {
    const info = await getFileInfo(this._path);
    if (!info) {
      logger.debug(`File ${this._path} does not exist`);
      return defaultValue;
    }

    try {
      logger.debug(`Reading file ${this._path}`);
      return await Deno.readTextFile(this._path);
    } catch (error) {
      logger.error(`Error reading file ${this._path}: ${error}`);
      return defaultValue;
    }
  }

  public async writeTextFile(content: string): Promise<boolean> {
    try {
      logger.debug(`Writing file ${this._path}`);
      await ensureDir(this._folder);
      await Deno.writeTextFile(this._path, content);
      return true;
    } catch (error) {
      logger.error(`Error writing file ${this._path}: ${error}`);
      return false;
    }
  }

  public async readJsonFile<T>(defaultValue: T): Promise<T> {
    const rawContent = await this.readTextFile();
    if (!rawContent) { return defaultValue; }

    try {
      logger.debug(`Parsing file ${this._path}`);
      return JSON.parse(rawContent) as T;
    } catch (error) {
      logger.error(`Error parsing file ${this._path}: ${error}`);
      return defaultValue;
    }
  }

  public async writeJsonFile<T>(content: T): Promise<boolean> {
    try {
      logger.debug(`Stringifying file ${this._path}`);
      const rawContent = JSON.stringify(content, null, 2);
      return await this.writeTextFile(rawContent);
    } catch (error) {
      logger.error(`Error stringifying file ${this._path}: ${error}`);
      return false;
    }
  }

  public static create = (path: string): IFileHandler => new FileHandler(path);
}
