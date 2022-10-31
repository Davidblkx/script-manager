import type { RootCommand } from '../root.ts';
export type { RootCommand, RootOptions } from '../root.ts';
export type { IScriptManager } from '../../core/model.ts';

import { config } from './config.ts';
import { where } from './where.ts';

export type CommandLoader = (cmd: RootCommand) => Promise<void> | void;

export const commands: CommandLoader[] = [
  config,
  where,
];
