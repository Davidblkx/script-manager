import { logger } from "../modules/logger.ts";

import type { IScriptManager, InitOptions } from "./model.ts";

import { buildDefaultOptions, initConfig, initSettingsManager } from './init/__.ts';

export async function initScritpManager(initOptions?: Partial<InitOptions>): Promise<IScriptManager> {
  const options = {
    ...buildDefaultOptions(),
    ...(cleanUndefined(initOptions)),
  }

  logger.setLogLevel(options.logLevel);
  const config = await initConfig(options);
  const settings = initSettingsManager(config);

  return {
    logger,
    config,
    settings,
  };
}

function cleanUndefined<T>(opt?: T): Partial<T> {
  // deno-lint-ignore no-explicit-any
  const input: any = opt ?? {};

  for (const key of Object.keys(input)) {
    if (input[key] === undefined) {
      delete input[key];
    }
  }

  return input;
}
