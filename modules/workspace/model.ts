import { IDirectory } from '../file-system/model.ts';

export interface IWorkspace {
  name: string;
  path: IDirectory;
  description?: string;
  active: boolean;
}

export interface IWorkspaceHandler {
  readonly active: IWorkspace | undefined;

  open(path: IDirectory | string, name?: string): Promise<IWorkspace>;
  close(): Promise<void>;
}
