import { createToken, declareService } from '../container/mod.ts';
import type { ISubprocessFactory } from './models.ts';
import { SubprocessFactory } from './factory.ts';
import { LOGGER_FACTORY } from '../logger/service.ts';

export const SUBPROCESS_FACTORY = createToken<ISubprocessFactory>('subprocess_factory');

export const subprocessFactoryService = declareService(SUBPROCESS_FACTORY, SubprocessFactory, LOGGER_FACTORY);
