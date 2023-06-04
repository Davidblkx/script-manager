import { AppInterfaceFactory } from './factory.ts';
import { IAppInterfaceFactory } from './models.ts';
import { createToken, declareService } from '../container/mod.ts';
import { SUBPROCESS_FACTORY } from '../subprocess/service.ts';
import { LOGGER_FACTORY } from '../logger/service.ts';

export const APP_INTERFACE_FACTORY = createToken<IAppInterfaceFactory>('aif');
export const aifService = declareService(
  APP_INTERFACE_FACTORY,
  AppInterfaceFactory,
  LOGGER_FACTORY,
  SUBPROCESS_FACTORY,
);
