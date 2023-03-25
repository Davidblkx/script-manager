import type { IServices } from "../../../modules/services.ts";
import type { InitializeOptions } from "../mod.ts";
import { ConfigFile } from "./config-file.ts";
import { join } from "$deno/path/mod.ts";

/**
 * Register config providers by order:
 *  - Environment variables
 *  - Current working directory
 *  - Machine config file (can be defined by passing --config-file)
 *  - User config file (can be defined by passing --config-file)
 */
export async function registerConfigs(
  services: IServices,
  {
    configFileName,
    configFilePath,
    useEnvirontment = true,
    scriptsPath,
  }: InitializeOptions
): Promise<URL> {
  const logger = services.get("logger").get("init.configs");
  const fs = services.get("file-system");
  const handler = services.get("config.handler");

  if (!configFileName || !configFilePath || !scriptsPath) {
    throw new Error("Invalid config file options");
  }

  // Register environment variables
  if (useEnvirontment) {
    logger.trace("Register environment variables");
    handler.regiterEnvironment();
  }

  // Register current working directory
  const cwdFile = join(Deno.cwd(), configFileName);
  const cwdConfig = await ConfigFile.create(services, "workdir", cwdFile);
  if (cwdConfig) {
    await handler.registerFile(cwdConfig);
  } else {
    logger.debug(`Config file not found: ${cwdFile}`);
  }

  // Register machine config file (can be defined by passing --config-file)
  const machineConfig = await ConfigFile.create(
    services,
    "machine",
    configFilePath,
    { path: scriptsPath }
  );
  if (machineConfig) {
    await handler.registerFile(machineConfig);
  } else {
    logger.debug(`Config file not found: ${configFilePath}`);
    return fs.getURL(Deno.cwd());
  }

  // Register user config
  const path = machineConfig.value.path ?? scriptsPath;
  const scriptConfigPath = join(path, configFileName);
  const scriptConfig = await ConfigFile.create(
    services,
    "scripts",
    scriptConfigPath,
    {}
  );
  if (scriptConfig) {
    await handler.registerFile(scriptConfig);
  } else {
    logger.debug(`Config file not found: ${scriptConfigPath}`);
  }

  return fs.getURL(path);
}
