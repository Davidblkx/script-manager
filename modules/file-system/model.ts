export type EntryState = 'file' | 'directory' | 'missing';

export interface IEntry {
  readonly path: URL;
  readonly parent: IDirectory;

  state(): Promise<EntryState>;
  stateSync(): EntryState;

  toFile(): Promise<IFile>;
  toFileSync(): IFile;
  toDirectory(): Promise<IDirectory>;
  toDirectorySync(): IDirectory;
}

export interface IFile {
  readonly path: URL;
  readonly parent: IDirectory;

  state(): Promise<EntryState>;

  write(data: string): Promise<void>;
  read(): Promise<string>;

  readBinary(): Promise<Uint8Array>;
  writeBinary(data: Uint8Array): Promise<void>;
}

export interface IDirectory {
  readonly path: URL;
  readonly parent: IDirectory;

  state(): Promise<EntryState>;

  list(): Promise<IEntry[]>;

  getFile(name: string): Promise<IFile>;
  getDirectory(name: string): Promise<IDirectory>;
  getEntry(name: string): IEntry;

  ensure(): Promise<IDirectory>;
  empty(): Promise<IDirectory>;
}

export interface IFileSystem {
  readonly home: URL;

  getURL(path: string, root?: string): URL;

  get(path: URL): IEntry;
  get(path: string, root?: string): IEntry;
  get(path: string | URL, root?: string): IEntry;

  copy(from: URL, to: URL, overwrite?: boolean): Promise<IEntry>;
  move(from: URL, to: URL, overwrite?: boolean): Promise<IEntry>;
  delete(path: URL, recurse?: boolean): Promise<void>;
  stat(path: URL): Promise<EntryState>;
}
