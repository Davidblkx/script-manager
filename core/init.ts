import { services } from "../modules/services.ts";
import { IScriptManager, ScriptManager } from "./script-manager.ts";

export async function initScriptManager(): Promise<IScriptManager> {
  services.registerDefaults();

  return new ScriptManager(services);
}
