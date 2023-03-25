import type { IServices } from "./init.model.ts";
import type { IConfigFile } from "../../modules/config/mod.ts";
import type { IFile } from "../../modules/file-system/mod.ts";
import { join } from "$deno/path/mod.ts";
import {
  loadConfigFile,
  updateConfigFile,
  readConfigFile,
} from "./config-loader.ts";

const configFileName = ".smx.json";

export const initConfigs = async (
  services: IServices,
  rootConfigFile: string
) => {
  const handler = services.get("config.handler");
  const fs = services.get("file-system");

  await handler.regiterEnvironment();

  await registerFile(services, "workdir", configFileName);
  const machineConfig = await registerFile(
    services,
    "machine",
    rootConfigFile,
    true
  );

  if (machineConfig?.path) {
    const path = join(machineConfig.path, configFileName);
    await registerFile(services, "user", path, true);
  }

  return machineConfig?.path
    ? fs.getURL(machineConfig.path)
    : fs.getURL(Deno.cwd());
};

export async function registerFile(
  services: IServices,
  name: string,
  path: string | URL,
  ensure = false
) {
  const logger = services.get("logger").get("init.configs");

  try {
    const file = await services.get("file-system").get(path).toFile();
    if ((await file.state()) === "missing" && !ensure) {
      logger.debug(`Config file not found: ${file.path.pathname}`);
      return;
    }

    const configValue = await loadConfigFile(services, path, ensure);
    const config = createFileConfig(
      name,
      file,
      configValue.configs ?? {},
      services
    );
    await services.get("config.handler").registerFile(config);
    logger.debug(`Config file registered: ${path}`);

    return configValue;
  } catch (error) {
    logger.error(`Error loading config file: ${path}`, error);
    return;
  }
}

function createFileConfig(
  name: string,
  file: IFile,
  initialData: Record<string, unknown>,
  services: IServices
): IConfigFile {
  return {
    isAvailable: () => file.state().then((state) => state === "file"),
    read: () => readConfigFile(file, services).then((d) => d.configs),
    write: (data) =>
      updateConfigFile(
        file,
        { configs: data },
        services
      ) as unknown as Promise<void>,
    name,
    initialData,
  };
}
