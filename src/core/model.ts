import { IConfigHandler } from '../modules/config.ts';
import { logger, LogLevel } from '../modules/logger.ts';
import { ISettingsManager } from '../modules/settings.ts';

export interface InitOptions {
  globalConfigPath: string;
  initLocalPath: boolean;
  logLevel: LogLevel;
  quiet: boolean;
  localConfigPath?: string;
  targetId?: string;
}

export interface IScriptManager {
  readonly logger: typeof logger;
  readonly config: IConfigHandler;
  readonly settings: ISettingsManager;
}
