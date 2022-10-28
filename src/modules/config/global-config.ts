import { join } from 'deno/path/mod.ts';

import { APP_VERSION } from "../../version.ts";
import { IFileHandlerFactory } from '../infra/file-handler.ts';
import { getFolder } from "../utils/file.ts";

import { GlobalConfig } from "./model.ts";
import { ConfigFile, ConfigFileOptions } from "./config-file.ts";

function buildLocalPath(local: string | undefined, target: [string, 'file' | 'folder']): string {
  if (local) {
    return local;
  }

  const [path, type] = target;
  const rootFolder = type == 'file' ? getFolder(path) : path;
  return join(rootFolder, '.smx');
}

export const DEFAULT_GLOBAL_CONFIG: GlobalConfig = {
  settings: {},
  version: APP_VERSION,
  path: "",
};

export class GlobalConfigFile extends ConfigFile<GlobalConfig> {
  constructor(options: ConfigFileOptions<GlobalConfig>) {
    super(options);
  }

  public static async load(
    path: [string, 'file' | 'folder'],
    fileFactory?: IFileHandlerFactory,
    localPath?: string,
  ): Promise<GlobalConfigFile> {
    const configFile = new GlobalConfigFile({
      path,
      fileFactory,
      initialConfig: {
        ...DEFAULT_GLOBAL_CONFIG,
        path: buildLocalPath(localPath, path),
      },
    });
    await configFile.init();
    return configFile;
  }
}
