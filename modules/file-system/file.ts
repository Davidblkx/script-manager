import type { IEntry, IFile, EntryState } from "./model.ts";
import type { ILoggerFactory, Logger } from "../logger/mod.ts";

export class File implements IFile {
  #entry: IEntry;
  #logger?: Logger;

  get path(): URL {
    return this.#entry.path;
  }

  constructor(entry: IEntry, loggerFactory?: ILoggerFactory) {
    this.#entry = entry;
    this.#logger = loggerFactory?.get("FileSystem:File");
  }

  state(): Promise<EntryState> {
    return this.#entry.state();
  }

  async write(data: string): Promise<void> {
    try {
      await Deno.writeTextFile(this.#entry.path.pathname, data);
    } catch (err) {
      this.#logger?.debug(`Failed to write to file: ${this.path}`, err);
      throw err;
    }
  }

  async read(): Promise<string> {
    try {
      return await Deno.readTextFile(this.#entry.path.pathname);
    } catch (err) {
      this.#logger?.debug(`Failed to read file: ${this.path}`, err);
      throw err;
    }
  }
}
