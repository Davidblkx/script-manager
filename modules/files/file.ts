export type FileState = 'file' | 'directory' | 'missing';

export interface IFile {
  readonly path: URL;

  state(): Promise<FileState>;

  write(data: string): Promise<void>;
  read(): Promise<string>;
}

export class File implements IFile {
  readonly path: URL;

  constructor(path: URL) {
    this.path = path;
  }

  async state(): Promise<FileState> {
    const info = await Deno.stat(this.path);

    if (info.isFile) {
      return 'file';
    } else if (info.isDirectory) {
      return 'directory';
    } else {
      return 'missing';
    }
  }

  async write(data: string): Promise<void> {
    await Deno.writeTextFile(this.path.pathname, data);
  }

  async read(): Promise<string> {
    return await Deno.readTextFile(this.path.pathname);
  }
}
