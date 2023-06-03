
# File System

This service abstracts the file system operations and provides a simple interface to work with files and directories. It also provides basic operations like copy, move, delete, etc.
The main interface is the `IFileSystem` which provides the following API:

```ts
interface IFileSystem {
  readonly home: URL; // The user home directory

  getURL(path: string, root?: string): URL;

  get(path: URL): IEntry;
  get(path: string, root?: string): IEntry;
  get(path: string | URL, root?: string): IEntry;

  copy(from: URL, to: URL, overwrite?: boolean): Promise<IEntry>;
  move(from: URL, to: URL, overwrite?: boolean): Promise<IEntry>;
  delete(path: URL, recurse?: boolean): Promise<void>;
  stat(path: URL): Promise<EntryState>;
}
```

| Method | Description |
| --- | --- |
| `getURL(path: string, root?: string): URL` | Returns a `URL` for the given path. If `root` is provided, it will be used as the base URL. It will resolve the `~` character to the user home directory. |
| `get(path: URL): IEntry` | Returns an `IEntry` for the given URL. |
| `get(path: string, root?: string): IEntry` | Returns an `IEntry` for the given path. If `root` is provided, it will be used as the base URL. It will resolve the `~` character to the user home directory. |
| `copy(from: URL, to: URL, overwrite?: boolean): Promise<IEntry>` | Copies the file or directory from `from` to `to`. If `overwrite` is `false` and the destination already exists, it will throw an error. |
| `move(from: URL, to: URL, overwrite?: boolean): Promise<IEntry>` | Moves the file or directory from `from` to `to`. If `overwrite` is `false` and the destination already exists, it will throw an error. |
| `delete(path: URL, recurse?: boolean): Promise<void>` | Deletes the file or directory at `path`. If `recurse` is `true` and the path is a directory, it will delete all the files and directories inside it. |
| `stat(path: URL): Promise<EntryState>` | Returns the state of the file or directory at `path`. It can be 'file', 'directory' or 'missing'. |

## IEntry

The `IEntry` interface is an abstraction of a file or directory. It provides an easy way to work with files and directories without having to worry about the underlying implementation. It provides the following API:

```ts
interface IEntry {
  readonly path: URL;

  state(): Promise<EntryState>;

  toFile(): Promise<IFile>;
  toDirectory(): Promise<IDirectory>;
}
```

| Method | Description |
| --- | --- |
| `state(): Promise<EntryState>` | Returns the state of the file or directory. It can be 'file', 'directory' or 'missing'. |
| `toFile(): Promise<IFile>` | Returns the `IFile` interface for the entry. If exists and is not a file, it will throw an error. |
| `toDirectory(): Promise<IDirectory>` | Returns the `IDirectory` interface for the entry. If exists and is not a directory, it will throw an error. |

## IFile

The `IFile` interface is an abstraction of a file. It provides an easy way to read/write to a file. It provides the following API:

```ts
interface IFile {
  readonly path: URL;

  state(): Promise<EntryState>;

  write(data: string): Promise<void>;
  read(): Promise<string>;
  readBinary(): Promise<Uint8Array>;
  writeBinary(data: Uint8Array): Promise<void>;
}
```

| Method | Description |
| --- | --- |
| `state(): Promise<EntryState>` | Returns the state of the file. It can be 'file' or 'missing'. |
| `write(data: string): Promise<void>` | Writes the given data to the file. |
| `read(): Promise<string>` | Reads the file and returns the content as a string. |
| `readBinary(): Promise<Uint8Array>` | Reads the file and returns the content as a `Uint8Array`. |
| `writeBinary(data: Uint8Array): Promise<void>` | Writes the given data to the file. |

> **Note:** If the file doesn't exist, it will be created.

## IDirectory

The `IDirectory` interface is an abstraction of a directory. It provides an easy way to work with files and directories inside a directory. It provides the following API:

```ts
interface IDirectory {
  readonly path: URL;

  state(): Promise<EntryState>;

  list(): Promise<IEntry[]>;

  getFile(name: string): Promise<IFile>;
  getDirectory(name: string): Promise<IDirectory>;
  getEntry(name: string): IEntry;

  ensure(): Promise<IDirectory>;
  empty(): Promise<IDirectory>;
}
```

| Method | Description |
| --- | --- |
| `state(): Promise<EntryState>` | Returns the state of the directory. It can be 'directory' or 'missing'. |
| `list(): Promise<IEntry[]>` | Returns a list of all the files and directories inside the directory. |
| `getFile(name: string): Promise<IFile>` | Returns the `IFile` interface for the file with the given name. If exist and is not a file, it will throw an error. |
| `getDirectory(name: string): Promise<IDirectory>` | Returns the `IDirectory` interface for the directory with the given name. If exist and is not a directory, it will throw an error. |
| `getEntry(name: string): IEntry` | Returns the `IEntry` interface for the file or directory with the given name. |
| `ensure(): Promise<IDirectory>` | Ensures that the directory exists. If it doesn't exist, it will be created. |
| `empty(): Promise<IDirectory>` | Deletes all the files and directories inside the directory. |

## Examples

```ts
const fs = services.get('file-system');
const home = await fs.get(fs.home).toDirectory();
// File is created in the user home directory
await home.getFile('test.txt').write('Hello World!');
```
