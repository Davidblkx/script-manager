import type { IScriptManager } from '../../core/model.ts';
import { IRunnable, IRunner } from "./models.ts";
import { logger } from '../logger.ts';
import { ITargetHandler } from "../targets.ts";
import { join } from 'deno/path/mod.ts';
import { getFileInfo } from '../utils/file.ts';

export class DenoRunner implements IRunner {
  #targetHandler: ITargetHandler;

  constructor(targetHandler: ITargetHandler) {
    this.#targetHandler = targetHandler;
  }

  async build(name: string): Promise<IRunnable | false> {
    try {
      const scriptPath = await this.#findScript(name);
      if (!scriptPath) { return false; }

      const { main } = await import(scriptPath);

      if (typeof main !== 'function') {
        logger.error(`Script ${name} does not export a main function`);
        Deno.exit(1);
      }

      return { name, action: main };
    } catch (e) {
      logger.error('Error building custom DENO script', e);
      Deno.exit(1);
    }
  }

  async run(runnable: IRunnable, context: IScriptManager): Promise<void> {
    logger.debug(`Running ${runnable.name}`);
    try {
      const args = this.#getArgs(runnable.name);
      await runnable.action(args, context);
    } catch (e) {
      logger.error('Error running custom DENO script', e);
      Deno.exit(1);
    }
  }

  async #findScript(name: string): Promise<string | undefined> {
    const target = await this.#targetHandler.current();
    if (!target) {
      logger.error('Target not found');
      Deno.exit(1);
    }

    const rootPath = target.path;
    const extentions = ['.ts', '.js'];

    for (const ext of extentions) {
      const scriptPath = join(rootPath, `${name}${ext}`);
      const fileInfo = await getFileInfo(scriptPath);
      if (fileInfo && fileInfo.isFile) {
        logger.debug(`Found script: ${scriptPath}`);
        return scriptPath;
      }
    }

    logger.debug(`Script not found: ${name}`);
  }

  #getArgs(name: string): string[] {
    const index = Deno.args.indexOf(name);
    const args = Deno.args.slice(index + 1);
    return args[0] === '--' ? args.slice(1) : args;
  }
}
