import type { IFileHandler, IReader, IWriter } from './models.ts';

/** Environment config reader */
export class EnvironmentConfig implements IReader {
  readonly name = 'environment';

  read(key: string): unknown {
    return Deno.env.get(key);
  }
}

/** File config reader/writer */
export class FileConfig implements IReader, IWriter {
  #name: string;
  #path: URL;
  #handler: IFileHandler;
  #srcFile?: Record<string, unknown>;

  constructor(name: string, path: URL, handler?: IFileHandler) {
    this.#name = name;
    this.#path = path;
    this.#handler = handler ?? {
      read: (path: URL) => Deno.readTextFileSync(path),
      write: (path: URL, content: string) => Deno.writeTextFileSync(path, content),
    }
  }

  get name() {
    return this.#name;
  }

  read(key: string): unknown {
    return this.#loadFile()[key];
  }

  write(key: string, value: unknown): void {
    const file = this.#loadFile();
    file[key] = value;
    this.#srcFile = file;
    this.#handler.write(this.#path, JSON.stringify(file));
  }

  #loadFile(): Record<string, unknown> {
    if (this.#srcFile) {
      return this.#srcFile;
    }

    try {
      const file = this.#handler.read(this.#path);
      this.#srcFile = JSON.parse(file);
    } catch {
      // TODO: log error
      this.#srcFile = {};
    }

    return this.#srcFile || {};
  }
}
