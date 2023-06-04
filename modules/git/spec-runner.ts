import { IGitSpecRunner, IGit, GitSpec } from './models.ts';

export class GitSpecRunner<T extends GitSpec> implements IGitSpecRunner<T> {
  #git: IGit;
  #spec: T;

  constructor(git: IGit, spec: T) {
    this.#git = git;
    this.#spec = spec;
  }

  run<P extends keyof T>(key: P, params?: Partial<T[P]["params"]>, cwd?: string): Promise<ReturnType<T[P]["parser"]>> {
    const spec = this.#spec[key];

    if (!spec) {
      throw new Error(`Spec ${key.toString()} not found`);
    }

    const toRun = {
      ...spec,
      params: {
        ...spec.params,
        ...params,
      },
    };
    return this.#git.run(toRun, cwd) as Promise<ReturnType<T[P]["parser"]>>;
  }
}
