import { logger } from "../modules/logger.ts";

import type { IScriptManager, InitOptions } from "./model.ts";

import { buildDefaultOptions, initConfig, initSettingsManager } from './init/__.ts';

export async function initScritpManager(initOptions?: Partial<InitOptions>): Promise<IScriptManager> {
  const options = {
    ...buildDefaultOptions(),
    ...(initOptions ?? {})
  }

  const config = await initConfig(options);
  const settings = initSettingsManager(config);

  return {
    logger,
    config,
    settings,
  };
}
