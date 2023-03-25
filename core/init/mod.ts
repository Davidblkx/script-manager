import { LogLevel } from "../../modules/logger/mod.ts";
import type { IServices } from "../../modules/services.ts";
import { initConfigs } from "./configs.ts";
import { initLogger } from "./logger.ts";

export type InitializeOptions = {
  logLevel?: number;
  configFile?: string;
};

export async function initialize(
  services: IServices,
  { logLevel = LogLevel.all, configFile = "~/.smx.json" }: InitializeOptions
) {
  initLogger(services, logLevel);
  await initConfigs(services, configFile);
}
