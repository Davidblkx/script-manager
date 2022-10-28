import { IFileHandlerFactory, FileHandler } from "../infra/file-handler.ts";
import {  } from "../utils/file.ts";
import { ConfigHandler, IConfigHandler } from "./config-handler.ts";

export class ConfigFactory {

  #factory: IFileHandlerFactory = (path, type) => new FileHandler(path, type);
  #globalPath: [string, 'file' | 'folder'] | undefined;
  #localPath: string | undefined;
  #initLocalPath = true;

  constructor() { }

  public setFileHandler(factory: IFileHandlerFactory): this {
    this.#factory = factory;
    return this;
  }

  public setGlobalPath(path: string, type: 'file' | 'folder'): this {
    this.#globalPath = [path, type];
    return this;
  }

  public setLocalPath(path: string | undefined): this {
    this.#localPath = path;
    return this;
  }

  public setInitLocalPath(init: boolean): this {
    this.#initLocalPath = init;
    return this;
  }

  public async build(): Promise<IConfigHandler> {
    const configHandler = new ConfigHandler(this.#factory);

    if (!this.#globalPath) {
      throw new Error("Global path is not set");
    }

    await configHandler.loadGlobalConfig(this.#globalPath, this.#localPath);

    if (this.#initLocalPath) {
      const localPath = configHandler.globalFile!.config.path;
      await configHandler.loadLocalConfig(localPath);
    }

    return configHandler;
  }
}
