import { createToken, declareService } from '../container/mod.ts';
import { SUBPROCESS_FACTORY } from '../subprocess/service.ts';
import { LOGGER_FACTORY } from '../logger/service.ts';
import type { IGit, IGitCommandBuilder, IGitHandler } from './models.ts';
import { GitCommandBuilder } from './builder.ts';
import { GitHandler } from './handler.ts';
import { Git } from './git.ts';

export const GIT_BUILDER = createToken<IGitCommandBuilder>('git_builder');
export const GIT_HANDLER = createToken<IGitHandler>('git_handler');
export const GIT = createToken<IGit>('git');

export const gitBuilderService = declareService(GIT_BUILDER, GitCommandBuilder, LOGGER_FACTORY);
export const gitHandlerService = declareService(
  GIT_HANDLER,
  GitHandler,
  LOGGER_FACTORY,
  GIT_BUILDER,
  SUBPROCESS_FACTORY,
);
export const gitService = declareService(GIT, Git, GIT_HANDLER);
