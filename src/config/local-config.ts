import { LocalConfig } from "./model.ts";
import { ConfigFile, ConfigFileOptions } from "./config-file.ts";
import { IFileHandlerFactory } from '../infra/file-handler.ts';
import { settingKeys } from '../settings/settings-names.ts';

export const DEFAULT_LOCAL_CONFIG: LocalConfig = {
  settings: {
    [settingKeys.editor.files.tool]: "code",
    [settingKeys.editor.folder.tool]: "code",
  },
  editors: {
    code: {
      args: ['code', '__TARGET_PATH'],
      context: ['file', 'folder'],
    },
    vi: {
      args: ['vi', '__TARGET_PATH'],
      context: 'file',
    }
  },
  targets: {
    main: {
      id: "main",
      name: "Main",
      settings: {},
    }
  },
  units: {},
  version: "0.1.0",
};

export class LocalConfigFile extends ConfigFile<LocalConfig> {
  constructor(options: ConfigFileOptions<LocalConfig>) {
    super(options);
  }

  public static async load(path: string, fileFactory?: IFileHandlerFactory): Promise<LocalConfigFile> {
    const configFile = new LocalConfigFile({
      path,
      fileFactory,
      initialConfig: DEFAULT_LOCAL_CONFIG,
    });
    await configFile.init();
    return configFile;
  }
}
