import { IGit, Git } from './mod.ts';
import { createToken, declareService } from '../container/mod.ts';
import { SUBPROCESS_FACTORY } from '../subprocess/service.ts';
import { LOGGER_FACTORY } from '../logger/service.ts';

export const GIT = createToken<IGit>('git');
export const gitService = declareService(GIT, Git, LOGGER_FACTORY, SUBPROCESS_FACTORY);
