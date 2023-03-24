import { services } from "../modules/services.ts";
import { IScriptManager, ScriptManager } from "./script-manager.ts";
import { initialize } from "./init/mod.ts";

export async function initScriptManager(): Promise<IScriptManager> {
  services.registerDefaults();

  await initialize(services);

  return new ScriptManager(services);
}
