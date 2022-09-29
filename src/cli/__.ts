import { rootCommand } from "../root.ts";
import { loadConfigFromHome } from '../core/__.ts';
import { logger } from '../logger.ts';

import { registerCoreCommands } from './core/__.ts';

export async function buildRootCommand() {
  logger.setLogLevelFromArgs();

  registerCoreCommands();

  await loadConfigFromHome();

  return rootCommand;
}
