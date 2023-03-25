import { IFile } from "../../modules/file-system/mod.ts";
import type { IServices } from "./init.model.ts";

export interface IConfig {
  configs: Record<string, unknown>;
  path?: string;
  version: string;
  repository?: string;
}

export async function loadConfigFile(
  services: IServices,
  path: string | URL,
  ensure = false
): Promise<IConfig> {
  const fs = services.get("file-system");
  const logger = services.get("logger").get("load.config");

  const file = await fs.get(path as string).toFile();
  logger.debug(`Config file path: ${file.path.pathname}`);

  const state = await file.state();
  if (state === "missing" && ensure) {
    logger.debug(`Config file not found: ${file.path.pathname}`);
    logger.warning(`Creating new config file: ${file.path.pathname}`);
    return await createConfigFile(services, file.path);
  } else if (state === "missing") {
    throw new Error(`Config file not found: ${file.path.pathname}`);
  }

  return await readConfigFile(file, services);
}

export async function readConfigFile(
  file: IFile,
  services?: IServices
): Promise<IConfig> {
  const logger = services?.get("logger").get("read.config");
  const content = await file.read();
  const data = JSON.parse(content) as IConfig;

  if ("settings" in data) {
    // TODO: Write migration for old config file
    logger?.error(`Config file is outdated: ${file.path.pathname}`);
  }

  return data;
}

export async function createConfigFile(
  services: IServices,
  path: URL,
  config: { path?: string } = {}
): Promise<IConfig> {
  const fs = services.get("file-system");
  const logger = services.get("logger").get("write.config");

  const file = await fs.get(path).toFile();

  const data: IConfig = {
    configs: {},
    version: "1.0.0",
    path: config.path,
  };

  logger.debug(`Writing config file: ${file.path.pathname}`);
  await file.write(JSON.stringify(data, null, 2));

  return data;
}

export async function updateConfigFile(
  file: IFile,
  data: Partial<IConfig>,
  services?: IServices
): Promise<IConfig> {
  const logger = services?.get("logger").get("update.config");
  const current = await readConfigFile(file, services);
  const updated = { ...current, ...data };

  logger?.debug(`Updating config file: ${file.path.pathname}`);
  await file.write(JSON.stringify(updated, null, 2));

  return updated;
}
