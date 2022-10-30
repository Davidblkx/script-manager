import { parseFlags } from 'cliffy/flags/flags.ts';
import { initScritpManager } from '../core/init.ts';
import { LogLevel } from '../modules/logger.ts';
import type { IScriptManager } from '../core/model.ts';

class CliSMXInstance implements IScriptManager {
  #smx: IScriptManager | undefined;
  #init = false;

  private get smx() {
    if (!this.#smx) { throw new Error('SMX not initialized'); }
    return this.#smx;
  }

  get logger() { return this.smx.logger; }
  get config() { return this.smx.config; }
  get settings() { return this.smx.settings; }

  public async init() {
    if (this.#init) { return; }
    this.#init = true;

    const options = this.#getInitOptions();
    this.#smx = await initScritpManager(options);
  }

  #getInitOptions() {
    const opt = this.#parseFlags();
    return {
      globalConfigPath: opt.config,
      initLocalPath: !opt.noLocal,
      localConfigPath: opt.local,
      logLevel: opt.quiet ? LogLevel.disabled : opt.verbose ? LogLevel.debug : LogLevel.warning,
      quiet: opt.quiet,
    }
  }

  #parseFlags() {
    const options = parseFlags(
      Deno.args,
      {
        allowEmpty: true,
        stopOnUnknown: true,
        stopEarly: true,
        flags: [{
          name: 'verbose',
          aliases: ['v'],
          type: 'boolean',
        }, {
          name: 'quiet',
          aliases: ['q'],
          type: 'boolean',
        }, {
          name: 'config',
          aliases: ['c'],
          type: 'string',
        }, {
          name: 'local',
          aliases: ['l'],
          type: 'string',
        }, {
          name: 'noLocal',
          type: 'boolean',
        }]
      }
    );

    return options.flags;
  }
}

export const CliSMX = new CliSMXInstance();
