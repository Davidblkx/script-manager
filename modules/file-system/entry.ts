import type { EntryState, IDirectory, IEntry, IFile } from './model.ts';
import type { ILoggerFactory, Logger } from '../logger/mod.ts';
import { getParentURL, stat, statSync } from './utils.ts';
import { File } from './file.ts';
import { Directory } from './directory.ts';

export class Entry implements IEntry {
  #logger?: Logger;
  #factory?: ILoggerFactory;
  #path: URL;
  #parent?: IDirectory;

  get path(): URL {
    return this.#path;
  }

  get parent(): IDirectory {
    if (!this.#parent) {
      const parentURL = getParentURL(this.#path);
      const entry = new Entry(parentURL, this.#factory);
      this.#parent = new Directory(
        entry,
        (url) => new Entry(url, this.#factory),
        this.#factory,
      );
    }

    return this.#parent;
  }

  constructor(path: URL, loggerFactory?: ILoggerFactory) {
    this.#path = path;
    this.#logger = loggerFactory?.get('FileSystem:Entry');
    this.#factory = loggerFactory;
  }

  #getState([s, url]: ['d' | 'f', URL]): EntryState {
    this.#path = url;
    return s === 'd' ? 'directory' : 'file';
  }

  async state(): Promise<EntryState> {
    try {
      return this.#getState(await stat(this.#path));
    } catch (err) {
      if (!(err instanceof Deno.errors.NotFound)) {
        this.#logger?.debug(err);
      }

      return 'missing';
    }
  }

  stateSync(): EntryState {
    try {
      return this.#getState(statSync(this.#path));
    } catch (err) {
      if (!(err instanceof Deno.errors.NotFound)) {
        this.#logger?.debug(err);
      }

      return 'missing';
    }
  }

  async toFile(): Promise<IFile> {
    const type = await this.state();
    if (type === 'file' || type === 'missing') {
      return new File(this, this.#factory);
    }

    throw new Error(`Entry is not a file: ${this.#path}`);
  }

  toFileSync(): IFile {
    const type = this.stateSync();
    if (type === 'file' || type === 'missing') {
      return new File(this, this.#factory);
    }

    throw new Error(`Entry is not a file: ${this.#path}`);
  }

  async toDirectory(): Promise<IDirectory> {
    const type = await this.state();
    if (type === 'directory' || type === 'missing') {
      return new Directory(
        this,
        (url) => new Entry(url, this.#factory),
        this.#factory,
      );
    }

    throw new Error(`Entry is not a directory: ${this.#path}`);
  }

  toDirectorySync(): IDirectory {
    const type = this.stateSync();
    if (type === 'directory' || type === 'missing') {
      return new Directory(
        this,
        (url) => new Entry(url, this.#factory),
        this.#factory,
      );
    }

    throw new Error(`Entry is not a directory: ${this.#path}`);
  }
}
