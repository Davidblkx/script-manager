import type { InitMod, IServices } from "./init.model.ts";
import { LogLevel } from "../../modules/logger/mod.ts";

export const initLogger: InitMod = (services: IServices) => {
  const logger = services.get("logger");
  logger.setLogLevel(LogLevel.all);
  logger.enableConsole();
};
