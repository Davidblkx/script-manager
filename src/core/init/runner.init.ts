import { IRunManager, RunManager } from "../../modules/runner.ts";
import { ITargetHandler } from "../../modules/targets.ts";

export function initScriptRunner(
  targetHandler: ITargetHandler,
): IRunManager {
  return new RunManager(targetHandler);
}
