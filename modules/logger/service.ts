import { createToken, declareService } from '../container/mod.ts';
import { ILoggerFactory } from './models.ts';
import { LoggerFactory } from './factory.ts';

export const LOGGER_FACTORY = createToken<ILoggerFactory>('LoggerFactory');

export const loggerFactoryService = declareService(LOGGER_FACTORY, LoggerFactory);
