import { services } from "../modules/services.ts";
import { IScriptManager, ScriptManager } from "./script-manager.ts";
import { initialize, InitializeOptions } from "./init/mod.ts";

export async function initScriptManager(
  options: InitializeOptions = {}
): Promise<IScriptManager> {
  services.registerDefaults();

  await initialize(services, options);

  return new ScriptManager(services);
}
