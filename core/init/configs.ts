import type { InitMod, IServices } from "./init.model.ts";
import type { IConfigFile } from "../../modules/config/mod.ts";
import type { IFile } from "../../modules/file-system/mod.ts";
import { join } from "$deno/path/mod.ts";

const configFileName = ".smx.json";
const configFolderName = ".smx";

export const initConfigs: InitMod = async (services: IServices) => {
  const handler = services.get("config.handler");

  await handler.regiterEnvironment();

  await registerFile(services, "workspace", Deno.cwd());
  await registerFile(services, "home", "~", true);
  await registerFile(services, "smx", join("~", configFolderName), true);
};

async function registerFile(
  services: IServices,
  name: string,
  directory: string,
  ensure = false
): Promise<void> {
  const fileSystem = services.get("file-system");
  const logger = services.get("logger").get("init.configs");
  const handler = services.get("config.handler");

  const dir = await fileSystem.get(directory).toDirectory();

  if (ensure) {
    await dir.ensure();
  }

  const file = await dir.getFile(configFileName);
  logger.debug(`Registering config file: ${file.path}`);

  const state = await file.state();
  if (state === "missing" && ensure) {
    logger.debug(`Creating config file: ${file.path}`);
    // TODO: Create file template
    await file.write("{ config: {} }");
  } else if (state === "missing") {
    logger.debug(`Config file not found: ${file.path}`);
    return;
  }

  try {
    const config = await createFileConfig(file);
    await handler.registerFile(name, config);
  } catch (error) {
    logger.error(`Error on config file: ${file.path}`, error);
  }
}

async function createFileConfig(file: IFile): Promise<IConfigFile> {
  await readConfig(file);

  return {
    isAvailable: () => file.state().then((state) => state === "file"),
    read: () => readConfig(file).then((data) => data.configs),
    write: async (data) => {
      const fileData = await readConfig(file);
      fileData.configs = data;
      await file.write(JSON.stringify(fileData, null, 2));
    },
  };
}

async function readConfig(
  file: IFile
): Promise<{ configs: Record<string, unknown> }> {
  const content = await file.read();

  const data = JSON.parse(content);
  if ("object" === typeof data.settings) {
    // TODO: migrate legacy settings
    throw new Error("Legacy settings not supported");
  }

  if ("object" !== typeof data.configs) {
    data.configs = {};
  }

  return data;
}
