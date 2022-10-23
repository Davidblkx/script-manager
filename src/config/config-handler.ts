import { GlobalConfigFile } from "./global-config.ts";
import { LocalConfigFile } from "./local-config.ts";
import { IFileHandlerFactory } from '../infra/file-handler.ts';
import { logger } from '../logger.ts';

export interface IConfigHandler {
  loadGlobalConfig(path?: string): Promise<void>;
  loadLocalConfig(path: string): Promise<void>;
  setTargetId(targetId: string): void

  readonly globalFile: GlobalConfigFile | undefined;
  readonly localFile: LocalConfigFile | undefined
  readonly targetId: string | undefined;
}

export class ConfigHandler implements IConfigHandler {
  #factory: IFileHandlerFactory;
  #globalFile: GlobalConfigFile | undefined;
  #localFile: LocalConfigFile | undefined;
  #targetId: string | undefined;

  constructor(factory: IFileHandlerFactory) {
    this.#factory = factory;
  }

  get globalFile(): GlobalConfigFile | undefined {
    return this.#globalFile;
  }

  get localFile(): LocalConfigFile | undefined {
    return this.#localFile;
  }

  get targetId(): string | undefined {
    return this.#targetId;
  }

  async loadGlobalConfig(path = ".smx.json"): Promise<void> {
    logger.debug(`Loading global config from ${path}`);
    this.#globalFile = await GlobalConfigFile.load(path, this.#factory);
  }

  async loadLocalConfig(path: string): Promise<void> {
    logger.debug(`Loading local config from ${path}`);
    this.#localFile = await LocalConfigFile.load(path, this.#factory);
  }

  setTargetId(targetId: string): void {
    logger.debug(`Setting targetId to ${targetId}`);
    this.#targetId = targetId;
  }
}
