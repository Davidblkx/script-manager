import type { IConfigHandler } from '../modules/config.ts';
import { logger, LogLevel } from '../modules/logger.ts';
import type { ISettingsManager, getSettingsObj } from '../modules/settings.ts';
import type { ITargetHandler } from '../modules/targets.ts';
import type { IEditorHandler } from '../modules/editor.ts';
import type { IGitHandler } from '../modules/git.ts';
import { IRunProcess } from "../modules/infra/run-process.ts";

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
  readonly editor: IEditorHandler;
  readonly git: IGitHandler;
  readonly runner: IRunProcess;
}
