import type { Logger } from '../modules/logger/mod.ts';
import { IServices } from '../modules/services.ts';
import { APP_VERSION } from '../version.ts';

export interface IScriptManager {
  readonly services: IServices;
  readonly root: URL;
  readonly version: string;
}

export class ScriptManager implements IScriptManager {
  #services: IServices;
  #root: URL;
  #logger: Logger;

  get root(): URL {
    return this.#root;
  }

  get services(): IServices {
    return this.#services;
  }

  get version(): string {
    return APP_VERSION;
  }

  constructor(services: IServices, root: URL) {
    this.#services = services;
    this.#root = root;

    this.#logger = services.get('logger').get('script-manager');
    this.#logger.debug('ScriptManager root at: ' + root.pathname);
  }
}

export type ModuleResult = string | number | boolean | void | {
  success: boolean;
  message?: string;
  data?: unknown;
};

export type ScriptManagerModule = (
  args: string[],
  context: IScriptManager,
) => ModuleResult | Promise<ModuleResult>;
