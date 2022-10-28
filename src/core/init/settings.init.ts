import { IConfigHandler } from "../../modules/config.ts";
import { ISettingsManager, SettingsManager, SettingsValidation } from "../../modules/settings.ts";

export function initSettingsManager(configHandler: IConfigHandler): ISettingsManager {
  const validator = SettingsValidation.buildDefault();
  return new SettingsManager({
    validator,
    configHandler
  });
}
