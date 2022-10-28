import { IConfigHandler } from '../modules/config.ts';
import { logger, LogLevel } from '../modules/logger.ts';
import { ISettingsManager } from '../modules/settings.ts';

export interface InitOptions {
  globalConfigPath: string;
  localConfigPath: string;
  initLocalPath: boolean;
  logLevel: LogLevel;
  quiet: boolean;
}

export interface IScriptManager {
  logger: typeof logger;
  config: IConfigHandler;
  settings: ISettingsManager;
}
