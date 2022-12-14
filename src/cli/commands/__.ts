import type { RootCommand } from '../root.ts';
export type { RootCommand, RootOptions } from '../root.ts';
export type { IScriptManager } from '../../core/model.ts';

import { createTarget } from './create-target.ts';
import { target } from './target.ts';
import { where } from './where.ts';
import { editorCommand } from './editor.ts';
import { init } from './init.ts';
import { status } from './status.ts';
import { sync } from './sync.ts';
import { execute } from './x.ts';

export type CommandLoader = (cmd: RootCommand) => Promise<void> | void;

export const commands: CommandLoader[] = [
  createTarget,
  target,
  where,
  editorCommand,
  init,
  status,
  sync,
  execute,
];
