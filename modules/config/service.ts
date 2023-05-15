import { createToken, declareService } from '../container/mod.ts';
import type { IConfigHandler, IConfigProvider } from './models.ts';
import { LOGGER_FACTORY } from '../logger/service.ts';
import { ConfigHandler } from './handler.ts';
import { ConfigProvider } from './provider.ts';

export const CONFIG_HANDLER = createToken<IConfigHandler>('config_handler');
export const CONFIG_PROVIDER = createToken<IConfigProvider>('config_provider');

export const condigHandlerService = declareService(
  CONFIG_HANDLER,
  ConfigHandler,
  LOGGER_FACTORY
);
export const configProviderService = declareService(CONFIG_PROVIDER, ConfigProvider);
