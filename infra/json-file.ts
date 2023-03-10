import { ISemVersion } from './semver.ts';

export type JsonValue<T> = {
  version: string;
} & T;

export interface IJsonFile<T> {
  readonly path: URL;
  readonly realtime: boolean;

  readonly value: JsonValue<T>;

  // Think about this
  // We need an abstraction to load files from disk
  // Should be able to initialize a file from a template
  // Should be able to load a file from disk
  // Should be able to save a file to disk
  // Should be able to reload a file from disk
  // Should be able to update a file template
}
