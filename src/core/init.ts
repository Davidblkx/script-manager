import { logger } from "../modules/logger.ts";

import type { IScriptManager, InitOptions, AppSettings } from "./model.ts";
import { DenoRunProcess } from "../modules/infra/run-process.ts";

import {
  buildDefaultOptions,
  initConfig,
  initSettingsManager,
  initTargetHandler,
  initEditorHandler,
  initGitHandler,
} from './init/__.ts';

export async function initScritpManager(initOptions?: Partial<InitOptions>): Promise<IScriptManager> {
  const options = {
    ...buildDefaultOptions(),
    ...(cleanUndefined(initOptions)),
  }

  logger.setLogLevel(options.logLevel);
  const config = await initConfig(options);
  const settings = initSettingsManager(config, options);
  const targets = initTargetHandler(config, settings);
  const editor = initEditorHandler(config, settings);
  const runner = new DenoRunProcess();
  const SMXSettings = settings.section<AppSettings>();
  const git = initGitHandler(config, SMXSettings, runner);

  return {
    logger,
    config,
    settings,
    targets,
    editor,
    SMXSettings,
    git,
    runner,
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
