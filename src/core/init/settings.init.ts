import { IConfigHandler, SettingsObject } from "../../modules/config.ts";
import { ISettingsManager, SettingsManager } from "../../modules/settings.ts";
import { logger } from "../../modules/logger.ts";
import type { TargetSettings } from '../../modules/targets.ts';
import type { InitOptions } from "../model.ts";

export function initSettingsManager(configHandler: IConfigHandler, options: InitOptions): ISettingsManager {
  const targetId = getTargetId(options, configHandler.localFile?.config.settings);

  logger.debug(`Initializing settings manager with targetId: ${targetId ?? 'undefined'}`);

  return new SettingsManager({
    configHandler: configHandler,
    target: targetId,
  });
}

function getTargetId(options: InitOptions, settings?: SettingsObject): string | undefined {
  if (options.targetId) {
    return options.targetId;
  }

  if (settings) {
    const key: keyof TargetSettings = 'targets.default';
    const defaultTargetId = settings[key];
    if (typeof defaultTargetId === 'string') {
      return defaultTargetId;
    }
  }

  return undefined;
}
