import { ITargetHandler, TargetHandler } from "../../modules/targets.ts";
import { DirHandler } from '../../modules/infra/dir-handler.ts';
import { IConfigHandler } from "../../modules/config.ts";
import { ISettingsManager } from "../../modules/settings.ts";
import { logger } from "../../modules/logger.ts";

export function initTargetHandler(
  configHandler: IConfigHandler,
  settings: ISettingsManager,
  targetId?: string,
): ITargetHandler {

  if (targetId) {
    const target = configHandler.localFile?.config.targets[targetId];
    if (!target) {
      logger.error(`Target ${targetId} not found`);
      Deno.exit(1);
    }
  }

  return new TargetHandler(
    configHandler,
    settings,
    DirHandler.create,
    targetId,
  )
}
