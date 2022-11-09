import type { IScriptManager } from '../../core/model.ts';

export type RunAction = (args: string[], context: IScriptManager) => Promise<void> | void;

export interface IRunnable {
  name: string;
  action: RunAction;
}

export interface IRunner {
  build(name: string): Promise<IRunnable | false>;
  run(runnable: IRunnable, context: IScriptManager): Promise<void>;
}

export interface IRunManager {
  run(name: string, context: IScriptManager): Promise<void>;
}
