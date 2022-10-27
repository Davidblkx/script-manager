import { GlobalConfig } from "./model.ts";
import { ConfigFile, ConfigFileOptions } from "./config-file.ts";
import { IFileHandlerFactory } from '../infra/file-handler.ts';

export const DEFAULT_GLOBAL_CONFIG: GlobalConfig = {
  settings: {},
  version: "0.1.0",
  path: ".smx",
};

export class GlobalConfigFile extends ConfigFile<GlobalConfig> {
  constructor(options: ConfigFileOptions<GlobalConfig>) {
    super(options);
  }

  public static async load(path = ".smx.json", fileFactory?: IFileHandlerFactory): Promise<GlobalConfigFile> {
    const configFile = new GlobalConfigFile({
      path,
      fileFactory,
      initialConfig: DEFAULT_GLOBAL_CONFIG,
    });
    await configFile.init();
    return configFile;
  }
}
