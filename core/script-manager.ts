import type { Logger } from "../modules/logger/mod.ts";
import { IServices } from "../modules/services.ts";

export interface IScriptManager {
  readonly services: IServices;
  readonly root: URL;
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

  constructor(services: IServices, root: URL) {
    this.#services = services;
    this.#root = root;

    this.#logger = services.get("logger").get("script-manager");
    this.#logger.debug("ScriptManager root at: " + root.pathname);
  }
}
