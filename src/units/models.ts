import type { HookMap, Hook } from '../core/hooks.ts';
import type { RootCommand } from '../root-command/root.ts';

export interface Unit<T extends string = Hook> {
  id: string;
  name: string;
  description: string;
  hooks: HookMap<T>;
  init?: (cmd: RootCommand) => Promise<void>;
}

export type { HookMap, Hook } from '../core/hooks.ts';
