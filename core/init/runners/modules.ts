import { IRunner, IRunResult, isRunResult } from '../../../modules/runner/mod.ts';
import type { Logger } from '../../../modules/logger/mod.ts';
import type {
  IScriptManager,
  ModuleResult,
  ScriptManagerModule,
} from '../../script-manager.ts';

export class ModulesRunner implements IRunner {
  name = 'internal-modules';
  description = 'Run scripts with ScriptManager context';
  // ends with mod.ts or mod.js
  target = /mod\.(ts|js)$/;

  #context: IScriptManager;
  #log: Logger;

  constructor(context: IScriptManager) {
    this.#context = context;
    this.#log = context.services.get('logger').get('runner.scripts');
  }

  async run(file: URL, args: string[]): Promise<IRunResult> {
    this.#log.debug(`Running ${file} with args: ${args}`);
    const module = await this.#loadModule(file);
    if (!module) return { success: false, message: 'Module not found' };

    try {
      const res = await module(args, this.#context);
      return parseResult(res);
    } catch (error) {
      this.#log.error(`Failed to run module: ${file.href}`, error);
      return { success: false, message: error.message };
    }
  }

  async #loadModule(file: URL): Promise<ScriptManagerModule | undefined> {
    try {
      const { main } = await import(file.href);
      return isScript(main) ? main : undefined;
    } catch (error) {
      this.#log.error(`Failed to load module: ${file.href}`, error);
      return undefined;
    }
  }
}

function isScript(value: unknown): value is ScriptManagerModule {
  return typeof value === 'function';
}

function parseResult(res: ModuleResult): IRunResult {
  if (isRunResult(res)) return res;
  if (typeof res === 'string') return { success: true, message: res };
  if (typeof res === 'number') return { success: res === 0, data: res };
  if (typeof res === 'boolean') return { success: res };
  return { success: true, data: res };
}
