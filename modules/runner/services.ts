import { createToken, declareService } from '../container/mod.ts';
import { LOGGER_FACTORY } from '../logger/service.ts';
import { IRunnerStore } from './model.ts';
import { RunnerStore } from './store.ts';

export const RUNNER_STORE = createToken<IRunnerStore>('runner_store');

export const runnerStoreService = declareService(
  RUNNER_STORE,
  RunnerStore,
  LOGGER_FACTORY,
);
