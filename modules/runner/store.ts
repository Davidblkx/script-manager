import { ILoggerFactory, Logger } from '../logger/models.ts';
import { IRun, IRunner, IRunnerStore } from './model.ts';

export class RunnerStore implements IRunnerStore {
  #set = new Set<IRunner>();
  #default: IRunner | undefined;
  #log: Logger;

  get list(): IRunner[] {
    return [...this.#set];
  }

  constructor(logFactory: ILoggerFactory) {
    this.#log = logFactory.get('runner-store');
  }

  add(runner: IRunner): void {
    this.#log.debug(`Adding runner ${runner.name}`);
    this.#set.add(runner);
  }

  remove(runner: IRunner): void {
    this.#log.debug(`Removing runner ${runner.name}`);
    this.#set.delete(runner);
  }

  default(): IRunner {
    if (this.#default) {
      return this.#default;
    }

    const errMessage = 'No default runner is set.';
    this.#log.error(errMessage);
    throw new Error(errMessage);
  }

  setDefault(runner: IRunner): void {
    this.#log.debug(`Setting default runner ${runner.name}`);
    this.#default = runner;
  }

  clearDefault(): void {
    this.#log.debug('Clearing default runner');
    this.#default = undefined;
  }

  create(file: URL, args: string[]): IRun {
    this.#log.debug(`Running ${file.href} with args ${args.join(' ')}`);
    const runner = this.list.find((runner) => runner.target.test(file.href)) ||
      this.default();

    if (!runner) {
      const errMessage = `No runner found for ${file.href}`;
      this.#log.error(errMessage);
      throw new Error(errMessage);
    }

    return {
      runner,
      args,
      file,
      run: () => runner.run(file, args),
    };
  }

  has(file: URL): boolean {
    return this.list.some((runner) => runner.target.test(file.href)) || !!this.#default;
  }
}
