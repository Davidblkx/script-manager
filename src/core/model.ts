import type { IConfigHandler } from '../modules/config.ts';
import { logger, LogLevel } from '../modules/logger.ts';
import type { ISettingsManager, getSettingsObj } from '../modules/settings.ts';
import type { ITargetHandler } from '../modules/targets.ts';

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
  readonly targets: ITargetHandler;
  readonly SMXSettings: ReturnType<typeof getSettingsObj>;
}
