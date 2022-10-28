import type { RootCommand } from './root.ts';
import { singleton } from '../modules/utils/singleton.ts';

export type CliPluginLoader = (cmd: RootCommand) => Promise<void> | void;

export const cliPlugins = singleton<CliPluginLoader[]>(() => []);
