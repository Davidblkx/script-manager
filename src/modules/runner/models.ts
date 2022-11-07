export type RunAction = (args: string[]) => Promise<void> | void;

export interface IRunnable {
  name: string;
  action: RunAction;
}

export interface IRunner {
  build(name: string): Promise<IRunnable | false>;
  run(runnable: IRunnable): Promise<void>;
}

export interface IRunManager {
  run(name: string): Promise<void>;
}
