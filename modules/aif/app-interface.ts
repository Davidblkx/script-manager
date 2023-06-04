import { ILoggerFactory, Logger } from '../logger/mod.ts';
import { ISubprocessFactory } from '../subprocess/mod.ts';
import { AppSpec, AppTarget, IAppInterface } from './models.ts';

export class AppInterface<T extends AppSpec> implements IAppInterface<T> {
  #log: Logger;
  #logFactory: ILoggerFactory;
  #runner: ISubprocessFactory;
  #target: AppTarget;
  #spec: T;
  #name: string;

  get target(): AppTarget {
    return this.#target;
  }

  get spec(): T {
    return this.#spec;
  }

  constructor(
    target: AppTarget,
    spec: T,
    loggerFactory: ILoggerFactory,
    subprocessFactory: ISubprocessFactory,
  ) {
    this.#spec = spec;
    this.#target = target;
    this.#logFactory = loggerFactory;
    this.#name = buildName(target);
    this.#log = loggerFactory.get(`spec-runner[${this.#name}]`);
    this.#runner = subprocessFactory;
  }

  async run<P extends keyof T>(
    key: P,
    params?: Partial<T[P]['params']>,
    options?: Deno.CommandOptions,
  ): Promise<ReturnType<T[P]['parser']>> {
    const spec = this.#spec[key];

    if (!spec) {
      throw new Error(`Spec ${key.toString()} not found`);
    }

    const args: string[] = [spec.command];
    const mergedParams = { ...spec.params, ...params };

    for (const [key, value] of Object.entries(mergedParams)) {
      if (key === 'cmd') continue;
      if (typeof value === 'undefined') continue;
      if (typeof value === 'boolean' && !value) continue;

      if (key.length === 1) {
        args.push(`-${key}`);
        continue;
      }

      const argName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      args.push(argName.startsWith('-') ? `-${argName}` : `--${argName}`);

      if (typeof value !== 'boolean' && isDefined<number>(value)) {
        args.push(value.toString());
      }
    }

    const cmdSpec = {
      ...mergedParams,
      cmd: spec.command,
    };

    try {
      return await this.#runner.exec({
        target: this.#target,
        handler: (res) =>
          spec.parser({
            ...res,
            spec: cmdSpec,
          }),
        runOptions: {
          args,
          ...options,
          stderr: 'piped',
          stdout: 'piped',
        },
      });
    } catch (ex) {
      const err = getError(ex);
      this.#log.warning(`Command ${spec.command} failed with error: ${err.message}`);
      this.#log.error(err);

      return spec.parser({
        spec: cmdSpec,
        code: 1,
        success: false,
        error: err,
        stderr: err.message,
      });
    }
  }

  extend<T2 extends AppSpec>(spec: T2): IAppInterface<T & T2> {
    return new AppInterface(
      this.#target,
      { ...this.#spec, ...spec },
      this.#logFactory,
      this.#runner,
    );
  }
}

function getError(ex: unknown): Error {
  if (ex instanceof Error) {
    return ex;
  }

  if (typeof ex === 'string') {
    return new Error(ex);
  }

  return new Error('Unknown error');
}

function isDefined<T>(value: unknown): value is T {
  return typeof value !== 'undefined' && typeof value !== 'object';
}

function buildName(target: AppTarget): string {
  if (typeof target === 'string') {
    return target;
  }

  if (target instanceof URL) {
    return target.pathname;
  }

  if ('default' in target) {
    return buildName(target.default);
  }

  return 'unknown';
}
