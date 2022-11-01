import { ensureDir, emptyDir } from 'deno/fs/mod.ts';
import { getFiles, exists } from 'getFiles';
import { logger } from '../logger.ts';

export interface IDirHandler {
  readonly path: string;
  readonly files: string[];
  readonly folders: string[];
  readonly exists: boolean;
  readonly isEmpty: boolean;
  readonly isLoaded: boolean;

  load(): Promise<void>;
  create(): Promise<boolean>;
  delete(): Promise<boolean>;
  empty(): Promise<boolean>;

  loadFolder(folder: string): Promise<IDirHandler>;
}

export type IDirHandlerFactory = (path: string) => Promise<IDirHandler>;

export class DirHandler implements IDirHandler {
  #path: string;
  #files: string[] = [];
  #folders: string[] = [];
  #exists = false;
  #isLoaded = false;

  public get path(): string {
    return this.#path;
  }

  public get files(): string[] {
    return this.#files;
  }

  public get folders(): string[] {
    return this.#folders;
  }

  public get exists(): boolean {
    return this.#exists;
  }

  public get isEmpty(): boolean {
    return this.#files.length === 0 && this.#folders.length === 0;
  }

  public get isLoaded(): boolean {
    return this.#isLoaded;
  }

  constructor(path: string) {
    this.#path = path;
  }

  public async load(): Promise<void> {
    this.#exists = await exists(this.#path);
    if (!this.#exists) {
      logger.debug(`Directory ${this.#path} does not exist`);
      this.#files = [];
      this.#folders = [];
      this.#isLoaded = true;
      return;
    }

    logger.debug(`Loading directory ${this.#path}`);
    const files = getFiles(this.#path);
    for (const file of files) {
      if (file.info?.isDirectory) {
        this.#folders.push(file.path);
      } else if(file.info?.isFile) {
        this.#files.push(file.path);
      }
    }
    logger.debug(`Files: ${this.#files.length} \nFolders: ${this.#folders.length}`);
    this.#isLoaded = true;
  }

  public async create(): Promise<boolean> {
    if (!this.#isLoaded) {
      logger.error(`Cannot create directory ${this.#path} because it is not loaded`);
      throw new Error('Directory is not loaded');
    }

    await ensureDir(this.#path);
    this.#exists = await exists(this.#path);
    return this.#exists;
  }

  public async delete(): Promise<boolean> {
    if (!this.#isLoaded) {
      logger.error(`Cannot delete directory ${this.#path} because it is not loaded`);
      throw new Error('Directory is not loaded');
    }

    if (!this.#exists) {
      logger.debug(`Directory ${this.#path} does not exist`);
      return true;
    }

    await Deno.remove(this.#path, { recursive: true });
    this.#exists = await exists(this.#path);
    return !this.#exists;
  }

  public async empty(): Promise<boolean> {
    if (!this.#isLoaded) {
      logger.error(`Cannot empty directory ${this.#path} because it is not loaded`);
      throw new Error('Directory is not loaded');
    }

    if (!this.#exists) {
      logger.debug(`Directory ${this.#path} does not exist`);
      return true;
    }

    await emptyDir(this.#path);
    this.#files = [];
    this.#folders = [];
    return this.isEmpty;
  }

  public async loadFolder(folder: string): Promise<IDirHandler> {
    if (!this.#isLoaded) {
      logger.error(`Cannot load folder ${folder} because directory ${this.#path} is not loaded`);
      throw new Error('Directory is not loaded');
    }

    if (!this.#exists) {
      logger.error(`Cannot load folder ${folder} because directory ${this.#path} does not exist`);
      throw new Error('Directory does not exist');
    }

    if (!this.#folders.includes(folder)) {
      logger.error(`Cannot load folder ${folder} because it does not exist in directory ${this.#path}`);
      throw new Error('Folder does not exist');
    }

    return await DirHandler.create(folder);
  }

  public static async create(path: string): Promise<IDirHandler> {
    const dirHandler = new DirHandler(path);
    await dirHandler.load();
    return dirHandler;
  }
}
