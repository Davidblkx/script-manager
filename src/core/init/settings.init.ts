import { IConfigHandler } from "../../modules/config.ts";
import { ISettingsManager, SettingsManager, SettingsValidation } from "../../modules/settings.ts";
import { settingKeys } from '../../modules/settings/settings-names.ts';

export function initSettingsManager(configHandler: IConfigHandler): ISettingsManager {
  const validator = SettingsValidation.buildDefault();

  const defaultTargetKey = settingKeys.targets.default;
  // TODO: clean this up
  const defaultTargetId = configHandler.localFile?.config.settings[defaultTargetKey];
  return new SettingsManager({
    validator,
    configHandler,
    targetId: typeof defaultTargetId === 'string' ? defaultTargetId : undefined,
  });
}
