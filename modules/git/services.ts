import { IGit } from './model.ts';
import { GIT_SPEC } from './commands/mod.ts';
import { createToken, declareFactory } from '../container/mod.ts';
import { APP_INTERFACE_FACTORY } from '../aif/services.ts';

export const GIT = createToken<IGit>('git');

export const gitService = declareFactory(
  GIT,
  (factory) => factory.create('git', GIT_SPEC),
  APP_INTERFACE_FACTORY,
);
