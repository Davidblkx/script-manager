import type { IServices } from "./init.model.ts";
import { LogLevel } from "../../modules/logger/mod.ts";
import { loadTerminalFeed } from "../../modules/logger/terminal-feed.ts";
import { loadConsoleFeed } from "../../modules/logger/console-feed.ts";

export const initLogger = (
  services: IServices,
  level: number = LogLevel.info,
  disableColor = false
) => {
  const logger = services.get("logger");

  logger.setLogLevel(level);

  const feed = disableColor ? loadConsoleFeed() : loadTerminalFeed();
  logger.addFeed(feed);
};
