import type { IConfigHandler } from '../modules/config.ts';
import { logger, LogLevel } from '../modules/logger.ts';
import type { ISection, ISettingsManager } from '../modules/settings.ts';
import type { ITargetHandler } from '../modules/targets.ts';
import type { IEditorHandler } from '../modules/editor.ts';
import type { IGitHandler } from '../modules/git.ts';
import { IRunProcess } from "../modules/infra/run-process.ts";

import type { EditorSettings } from '../modules/editor.ts';
import type { GitSettings } from '../modules/git.ts';
import type { TargetSettings } from '../modules/targets.ts';

export type AppSettings = EditorSettings & GitSettings & TargetSettings;

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
  readonly SMXSettings: ISection<AppSettings>;
  readonly editor: IEditorHandler;
  readonly git: IGitHandler;
  readonly runner: IRunProcess;
}
