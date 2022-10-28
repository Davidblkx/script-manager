import type { InitOptions } from "../model.ts";
import { IConfigHandler, ConfigFactory } from "../../modules/config.ts";
import { logger } from "../../modules/logger.ts";

export async function initConfig(opt: InitOptions): Promise<IConfigHandler> {
  const factory = new ConfigFactory()
    .setGlobalPath(opt.globalConfigPath, "file")
    .setLocalPath(opt.localConfigPath)
    .setInitLocalPath(opt.initLocalPath ?? true);

  logger.debug("Loading configuration");
  try {
    const handler = await factory.build();
    logger.debug("Configuration loaded");
    return handler;
  } catch (e) {
    logger.error("Failed to load configuration");
    throw e;
  }
}
