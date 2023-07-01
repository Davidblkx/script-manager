import { CONFIG_HANDLER } from '../config/service.ts';
import { createToken, declareFactory, declareService } from '../container/mod.ts';
import { IDirectory, IFileSystem } from '../file-system/model.ts';
import { LOGGER_FACTORY } from '../logger/service.ts';
import { WorkspaceHandler } from './handler.ts';
import { IWorkspaceHandler } from './model.ts';
import { FILE_SYSTEM } from '../file-system/services.ts';

export const WORKSPACE_ROOT = createToken<IDirectory>('workspaceRoot');
export const WORKSPACE = createToken<IWorkspaceHandler>('workspace');

export const workspaceService = declareService(
  WORKSPACE,
  WorkspaceHandler,
  LOGGER_FACTORY,
  WORKSPACE_ROOT,
  CONFIG_HANDLER,
);

export const declareWorkspaceRoot = (url: URL) =>
  declareFactory(
    WORKSPACE_ROOT,
    (fs: IFileSystem) => fs.get(url).toDirectory(),
    FILE_SYSTEM,
  );
