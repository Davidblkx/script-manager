import { IConfigHandler, SettingsObject } from "../../modules/config.ts";
import { ISettingsManager, SettingsManager, SettingsValidation } from "../../modules/settings.ts";
import { logger } from "../../modules/logger.ts";
import { settingKeys } from '../../modules/settings/settings-names.ts';
import type { InitOptions } from "../model.ts";

export function initSettingsManager(configHandler: IConfigHandler, options: InitOptions): ISettingsManager {
  const validator = SettingsValidation.buildDefault();
  const targetId = getTargetId(options, configHandler.localFile?.config.settings);

  logger.debug(`Initializing settings manager with targetId: ${targetId ?? 'undefined'}`);

  return new SettingsManager({
    validator,
    configHandler,
    targetId,
  });
}

function getTargetId(options: InitOptions, settings?: SettingsObject): string | undefined {
  if (options.targetId) {
    return options.targetId;
  }

  if (settings) {
    const defaultTargetKey = settingKeys.targets.default;
    const defaultTargetId = settings[defaultTargetKey];
    if (typeof defaultTargetId === 'string') {
      return defaultTargetId;
    }
  }

  return undefined;
}
