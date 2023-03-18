import type { EntryState, IEntry, IFile, IDirectory } from "./model.ts";
import type { ILoggerFactory, Logger } from "../logger/mod.ts";
import { stat } from "./utils.ts";
import { File } from "./file.ts";
import { Directory } from "./directory.ts";

export class Entry implements IEntry {
  #logger?: Logger;
  #factory?: ILoggerFactory;
  #path: URL;

  get path(): URL {
    return this.#path;
  }

  constructor(path: URL, loggerFactory?: ILoggerFactory) {
    this.#path = path;
    this.#logger = loggerFactory?.get("FileSystem:Entry");
    this.#factory = loggerFactory;
  }

  async state(): Promise<EntryState> {
    try {
      const [s, url] = await stat(this.#path);
      this.#path = url;

      return s === "d" ? "directory" : "file";
    } catch (err) {
      if (!(err instanceof Deno.errors.NotFound)) {
        this.#logger?.debug(err);
      }

      return "missing";
    }
  }

  async toFile(): Promise<IFile> {
    const type = await this.state();
    if (type === "file" || type === "missing") {
      return new File(this, this.#factory);
    }

    throw new Error(`Entry is not a file: ${this.#path}`);
  }

  async toDirectory(): Promise<IDirectory> {
    const type = await this.state();
    if (type === "directory" || type === "missing") {
      return new Directory(
        this,
        (url) => new Entry(url, this.#factory),
        this.#factory
      );
    }

    throw new Error(`Entry is not a directory: ${this.#path}`);
  }
}
