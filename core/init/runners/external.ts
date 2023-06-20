import { IRunner } from '../../../modules/runner/mod.ts';
import type { IScriptManager } from '../..//script-manager.ts';
import type { Logger } from '../../../modules/logger/mod.ts';
import type { ISubprocessFactory } from '../../../modules/subprocess/mod.ts';

export class ExternalRunner implements IRunner {
  name = 'external-scripts';
  description = 'Run scripts with OS context';
  target = /.*/;

  #log: Logger;
  #subprocess: ISubprocessFactory;

  constructor(context: IScriptManager) {
    this.#log = context.services.get('logger').get('runner.external');
    this.#subprocess = context.services.get('subprocess');
  }

  async run(file: URL, args: string[]) {
    const process = this.#subprocess.create({
      target: file,
      runOptions: { args },
      handler: (res) => ({
        success: res.success,
        message: res.success ? res.stdout : res.stderr,
      }),
    });

    try {
      return await process.exec();
    } catch (error) {
      this.#log.error(`Failed to run script: ${file.href}`, error);
      return { success: false, message: error.message };
    }
  }
}
