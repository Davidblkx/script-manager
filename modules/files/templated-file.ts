import { IFile, File } from './file.ts';

export interface ITemplatedFile<T> {
  readonly template: string;
  readonly file: IFile;

  write(data: T): Promise<void>;
  read(): Promise<T>;
}

export class TemplatedFile<T> implements ITemplatedFile<T> {
  readonly template: string;
  readonly file: IFile;

  #parser: (data: string) => T;
  #stringify: (data: T) => string;

  constructor({
    file,
    template,
    parser = e => JSON.parse(e),
    stringify = e => JSON.stringify(e),
  }: {
    file: IFile | URL;
    template: string;
    parser?: (data: string) => T;
    stringify?: (data: T) => string;
  }) {
    this.template = template;
    this.file = file instanceof URL ? new File(file) : file;
    this.#parser = parser;
    this.#stringify = stringify;
  }

  async write(data: T): Promise<void> {
    const info = await this.file.state();
    if (info === 'directory') {
      throw new Error(`Cannot write to directory ${this.file.path}`);
    }

    await this.file.write(this.#stringify(data));
  }

  async read(): Promise<T> {
    const info = await this.file.state();
    if (info === 'directory') {
      throw new Error(`Cannot read from directory ${this.file.path}`);
    } else if (info === 'missing') {
      await this.file.write(this.template);
      return this.#parser(this.template);
    }

    return this.#parser(await this.file.read());
  }
}
