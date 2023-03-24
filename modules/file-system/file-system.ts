import type { IEntry, EntryState, IFileSystem } from "./model.ts";
import type { ILoggerFactory, Logger } from "../logger/mod.ts";
import { join, toFileUrl, isAbsolute } from "$deno/path/mod.ts";
import { copy, move } from "$deno/fs/mod.ts";
import { Entry } from "./entry.ts";

export class FileSystem implements IFileSystem {
  #logger?: Logger;
  #factory?: ILoggerFactory;
  #home?: URL;

  get home(): URL {
    if (!this.#home) {
      const home =
        Deno.env.get("HOME") ||
        Deno.env.get("USERPROFILE") ||
        Deno.env.get("HOMEPATH") ||
        Deno.env.get("HOMEDRIVE") ||
        Deno.cwd();

      this.#home = toFileUrl(home);
    }
    return this.#home;
  }

  constructor(loggerFactory?: ILoggerFactory) {
    this.#logger = loggerFactory?.get("FileSystem");
    this.#factory = loggerFactory;
  }

  getURL(path: string, root?: string | undefined): URL {
    let fullPath = root ? join(root, path) : path;

    if (path.startsWith("~")) {
      fullPath = join(this.home.pathname, path.substring(1));
    }

    if (!isAbsolute(fullPath)) {
      fullPath = join(Deno.cwd(), fullPath);
    }
    return toFileUrl(fullPath);
  }

  get(path: URL): IEntry;
  get(path: string, root?: string | undefined): IEntry;
  get(path: string | URL, root?: string | undefined): IEntry {
    const url = typeof path === "string" ? this.getURL(path, root) : path;
    return new Entry(url, this.#factory);
  }

  async copy(from: URL, to: URL, overwrite = false): Promise<IEntry> {
    try {
      await copy(from, to, {
        overwrite,
        preserveTimestamps: false,
      });
      return this.get(to);
    } catch (err) {
      this.#logger?.debug(`Failed to copy file: ${from} to ${to}`, err);
      throw err;
    }
  }

  async move(from: URL, to: URL, overwrite = false): Promise<IEntry> {
    try {
      await move(from, to, { overwrite });
      return this.get(to);
    } catch (err) {
      this.#logger?.debug(`Failed to move file: ${from} to ${to}`, err);
      throw err;
    }
  }

  async delete(path: URL, recurse = false): Promise<void> {
    try {
      await Deno.remove(path, {
        recursive: recurse,
      });
    } catch (err) {
      this.#logger?.debug(`Failed to delete path: ${path}`, err);
      throw err;
    }
  }

  stat(path: URL): Promise<EntryState> {
    return this.get(path).state();
  }
}
