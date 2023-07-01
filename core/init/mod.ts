import { LogLevel } from '../../modules/logger/mod.ts';
import type { IServices } from '../../modules/services.ts';
import { registerConfigs } from './config-file/init.ts';
import { initLogger } from './logger.ts';
import { declareWorkspaceRoot } from '../../modules/workspace/service.ts';

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
    configFileName = '.smx.json',
    configFilePath = `~/${configFileName}`,
    useEnvirontment = true,
    scriptsPath = '~/.smx',
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
  services.get('workspace').open('main');

  return root;
}

export * from './runners/mod.ts';
