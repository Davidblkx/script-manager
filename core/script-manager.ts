import { IServices } from "../modules/services.ts";

export interface IScriptManager {
  readonly services: IServices;
}

export class ScriptManager implements IScriptManager {
  #services: IServices;

  public get services(): IServices {
    return this.#services;
  }

  constructor(services: IServices) {
    this.#services = services;
  }
}
