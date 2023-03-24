import type { IServices } from "../../modules/services.ts";
import { initConfigs } from "./configs.ts";
import { initLogger } from "./logger.ts";

export async function initialize(services: IServices) {
  await initLogger(services);
  await initConfigs(services);
}
