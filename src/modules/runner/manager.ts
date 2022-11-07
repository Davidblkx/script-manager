import { IRunManager, IRunner } from "./models.ts";
import { DenoRunner } from './deno-runner.ts';
import { ITargetHandler } from "../targets.ts";
import { logger } from '../logger.ts';

export class RunManager implements IRunManager {
  #denoRunner: IRunner;

  constructor(targetHandler: ITargetHandler) {
    this.#denoRunner = new DenoRunner(targetHandler);
  }

  async run(name: string): Promise<void> {
    const runnable = await this.#denoRunner.build(name);
    if (!runnable) {
      logger.error(`Script ${name} not found`);
      return;
    }

    try {
      await this.#denoRunner.run(runnable);
    } catch (e) {
      logger.error('Error running custom script', e);
      Deno.exit(1);
    }
  }
}
