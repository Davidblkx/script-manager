import type { IServices } from "./init.model.ts";
import { LogLevel } from "../../modules/logger/mod.ts";
import { loadTerminalFeed } from "../../modules/logger/terminal-feed.ts";

export const initLogger = (
  services: IServices,
  level: number = LogLevel.info
) => {
  const logger = services.get("logger");

  logger.setLogLevel(level);

  logger.addFeed(loadTerminalFeed());
};
