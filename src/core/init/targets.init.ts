import { ITargetHandler, TargetHandler } from "../../modules/targets.ts";
import { DirHandler } from '../../modules/infra/dir-handler.ts';
import { IConfigHandler } from "../../modules/config.ts";
import { ISettingsManager } from "../../modules/settings.ts";

export function initTargetHandler(
  configHandler: IConfigHandler,
  settings: ISettingsManager,
): ITargetHandler {
  return new TargetHandler(
    configHandler,
    settings,
    DirHandler.create
  )
}
