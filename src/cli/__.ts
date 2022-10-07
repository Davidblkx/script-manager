import { rootCommand } from "../root.ts";
import { loadConfigFromHome } from '../core/__.ts';
import { logger } from '../logger.ts';

import { registerCoreCommands } from './core/__.ts';
import { registerExecuteCommand } from './execute/__.ts';

export async function buildRootCommand() {
  logger.setLogLevelFromArgs();

  registerCoreCommands();
  registerExecuteCommand();

  await loadConfigFromHome();

  return rootCommand;
}
