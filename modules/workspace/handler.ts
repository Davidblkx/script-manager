import { IDirectory } from '../file-system/mod.ts';
import { IConfigHandler, IFileConfig } from '../config/mod.ts';
import { Logger } from '../logger/mod.ts';
import { ILoggerFactory } from '../logger/models.ts';
import { IWorkspace, IWorkspaceHandler } from './model.ts';

export class WorkspaceHandler implements IWorkspaceHandler {
  #cache: Record<string, IWorkspace> = {};
  #current: IWorkspace | undefined;
  #root: IDirectory;
  #logger: Logger;
  #config: IConfigHandler;
  #history: string[] = [];
  #configFileName: string;

  constructor(
    logFactory: ILoggerFactory,
    root: IDirectory,
    config: IConfigHandler,
    fileName: string,
  ) {
    this.#root = root;
    this.#logger = logFactory.get('workspace');
    this.#config = config;
    this.#configFileName = fileName;
  }

  get active(): IWorkspace | undefined {
    return this.#current;
  }

  async open(path: IDirectory | string, name?: string): Promise<IWorkspace> {
    name ??= typeof path === 'string' ? `#main:${path}` : path.path.toString();
    this.#logger.debug(`Opening workspace '${name}'`);

    let ws = this.#cache[name];
    if (!ws) {
      ws = await this.#createWorkspace(name, path);
      this.#cache[name] = ws;
      this.#logger.debug(`Workspace '${name}' created`);
    } else if (ws.active) {
      this.#logger.debug(`Workspace '${name}' already active`);
      return ws;
    }

    if (this.#current) {
      this.#logger.debug(`Closing workspace '${this.#current.name}'`);
      this.#current.active = false;
      this.#history.push(this.#current.name);
    }

    ws.active = true;
    this.#current = ws;

    return ws;
  }

  async close(): Promise<void> {
    const name = this.#current?.name;
    if (!name) return;

    this.#logger.debug(`Closing workspace '${name}'`);
    const ws = this.#cache[name];
    ws.active = false;
    this.#current = undefined;

    const lastUSed = this.#history.pop();
    const last = lastUSed ? this.#cache[lastUSed] : undefined;
    if (last) {
      await this.open(last.path, last.name);
    }

    return;
  }

  async #createWorkspace(name: string, path: IDirectory | string): Promise<IWorkspace> {
    try {
      const dir = typeof path === 'string' ? await this.#root.getDirectory(path) : path;
      const ws = {
        name,
        path: dir,
        active: false,
      };

      const config: IFileConfig = {
        name: `workspace.${name}`,
        file: dir.getEntry(this.#configFileName),
        at: 1,
        initialData: {},
        init: true,
        canUse: () => ws.active,
      };
      await this.#config.registerFileConfig(config);

      return ws;
    } catch (err) {
      this.#logger.error(`Failed to create workspace '${name}'`, err);
      throw err;
    }
  }
}
