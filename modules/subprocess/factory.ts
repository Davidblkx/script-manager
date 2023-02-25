import { CommandResult, CommandTarget, ISubprocessFactory, Subprocess, SubprocessOptions } from './models.ts';
import type { ILoggerFactory, Logger } from '../logger/models.ts';

export class SubprocessFactory implements ISubprocessFactory {
  #logger: Logger;

  constructor(logFactory: ILoggerFactory) {
    this.#logger = logFactory.get('subprocess_factory');
  }

  create<T>(options: SubprocessOptions<T>): Subprocess<T> {
    const logger = this.#logger;
    const target = this.#readTarget(options.target);
    logger.trace(`Creating subprocess for ${target}`);

    const cmd = new Deno.Command(target, {
      ...options.runOptions,
      stderr: 'piped',
      stdout: 'piped',
    });
    const child = cmd.spawn();
    logger.trace(`Subprocess created for ${target}`);

    return {
      child,
      async exec(): Promise<T> {
        const res = await run(child, logger, target, options.runOptions?.args ?? []);
        return options.handler ? options.handler(res) : res as unknown as T;
      },
    };
  }

  exec<T>(options: SubprocessOptions<T>): Promise<T> {
    const sub = this.create(options);
    return sub.exec();
  }

  #readTarget(t: CommandTarget): string | URL {
    if (typeof t === 'string' || t instanceof URL) {
      return t;
    }

    return t[Deno.build.os] ?? t.default;
  }
}

async function run(child: Deno.ChildProcess, l: Logger, t: string | URL, args: string[]): Promise<CommandResult> {
  try {
    l.trace(`Subprocess started for: ${t} ${args.join(' ')}`);
    const res = await child.output();
    l.trace(`Subprocess finished with code: ${res.code}`);

    const stdout = new TextDecoder().decode(res.stdout);
    const stderr = new TextDecoder().decode(res.stderr);

    return {
      code: res.code,
      success: res.success,
      stderr,
      stdout,
    };
  } catch (e) {
    l.error(`Failed to run ${t} ${args.join(' ')}`, e);
    return {
      code: 1,
      success: false,
      error: e,
    };
  }
}
