import type { EntryState, IDirectory, IEntry, IFile } from './model.ts';
import type { ILoggerFactory, Logger } from '../logger/mod.ts';
import { join, toFileUrl } from '$deno/path/mod.ts';
import { emptyDir, ensureDir } from '$deno/fs/mod.ts';

export class Directory implements IDirectory {
  #entry: IEntry;
  #toEntry: (entry: URL) => IEntry;
  #logger?: Logger;

  get path(): URL {
    return this.#entry.path;
  }

  constructor(
    entry: IEntry,
    toEntry: (url: URL) => IEntry,
    loggerFactory?: ILoggerFactory,
  ) {
    this.#entry = entry;
    this.#toEntry = toEntry;
    this.#logger = loggerFactory?.get('FileSystem:Directory');
  }

  async list(): Promise<IEntry[]> {
    try {
      const walkList = Deno.readDir(this.path);
      const result: IEntry[] = [];

      for await (const entry of walkList) {
        result.push(this.getEntry(entry.name));
      }

      return result;
    } catch (err) {
      this.#logger?.debug(`Failed to list directory: ${this.path}`, err);
      throw err;
    }
  }

  async getFile(name: string): Promise<IFile> {
    return await this.getEntry(name).toFile();
  }

  async getDirectory(name: string): Promise<IDirectory> {
    return await this.getEntry(name).toDirectory();
  }

  getEntry(name: string): IEntry {
    const fullPath = join(this.path.pathname, name);
    return this.#toEntry(toFileUrl(fullPath));
  }

  async ensure(): Promise<IDirectory> {
    try {
      await ensureDir(this.path);
      return this;
    } catch (err) {
      this.#logger?.debug(`Failed to create directory: ${this.path}`, err);
      throw err;
    }
  }

  async empty(): Promise<IDirectory> {
    try {
      await emptyDir(this.path.pathname);
      return this;
    } catch (err) {
      this.#logger?.debug(`Failed to empty directory: ${this.path}`, err);
      throw err;
    }
  }

  state(): Promise<EntryState> {
    return this.#entry.state();
  }
}
