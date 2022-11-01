import type { RootCommand } from '../root.ts';
export type { RootCommand, RootOptions } from '../root.ts';
export type { IScriptManager } from '../../core/model.ts';

import { config } from './config.ts';
import { createTarget } from './create-target.ts';
import { target } from './target.ts';
import { where } from './where.ts';
import { editorCommand } from './editor.ts';
import { init } from './init.ts';
import { status } from './status.ts';

export type CommandLoader = (cmd: RootCommand) => Promise<void> | void;

export const commands: CommandLoader[] = [
  config,
  createTarget,
  target,
  where,
  editorCommand,
  init,
  status,
];
