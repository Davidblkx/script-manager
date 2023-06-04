import { ILoggerFactory } from '../logger/mod.ts';
import { ISubprocessFactory } from '../subprocess/mod.ts';
import { AppInterface } from './app-interface.ts';
import {
  AppSpec,
  AppTarget,
  CommandResult,
  CommandSpec,
  IAppInterface,
  IAppInterfaceFactory,
} from './models.ts';

export class AppInterfaceFactory implements IAppInterfaceFactory {
  #logFactory: ILoggerFactory;
  #runner: ISubprocessFactory;

  constructor(
    loggerFactory: ILoggerFactory,
    subprocessFactory: ISubprocessFactory,
  ) {
    this.#logFactory = loggerFactory;
    this.#runner = subprocessFactory;
  }

  create<T extends AppSpec>(target: AppTarget, spec: T): IAppInterface<T> {
    return new AppInterface(target, spec, this.#logFactory, this.#runner);
  }
}

export function buildCommandSpec<
  P extends Record<string, string | number | boolean>,
  C extends string,
  T,
>(
  command: C,
  params: P,
  parser: (result: CommandResult<P, C>) => Promise<T> | T,
): CommandSpec<P, C, T> {
  return {
    command,
    params,
    parser,
  };
}
