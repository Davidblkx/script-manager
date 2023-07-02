import { LogLevel } from '../../modules/logger/mod.ts';
import type { IServices } from '../../modules/services.ts';
import { registerConfigs } from './config-file/init.ts';
import { initLogger } from './logger.ts';
import {
  declareWorkspaceConfig,
  declareWorkspaceRoot,
} from '../../modules/workspace/service.ts';

export type InitializeOptions = {
  logLevel?: number;
  disableColor?: boolean;
  configFileName?: string;
  configFilePath?: string;
  useEnvirontment?: boolean;
  scriptsPath?: string;
};

export async function initialize(
  services: IServices,
  {
    logLevel = LogLevel.all,
    disableColor = false,
    configFileName = '.script-manager.json',
    configFilePath = `~/${configFileName}`,
    useEnvirontment = true,
    scriptsPath = '~/.scripts',
  }: InitializeOptions,
) {
  initLogger(services, logLevel, disableColor);
  const root = await registerConfigs(services, {
    configFileName,
    configFilePath,
    useEnvirontment,
    scriptsPath,
  });

  services.container.register(declareWorkspaceRoot(root));
  services.container.register(declareWorkspaceConfig(configFileName));
  await services.get('workspace').open('main');

  return root;
}

export * from './runners/mod.ts';
