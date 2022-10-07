import type { HookMap, Hook } from '../core/hooks.ts';

export interface Unit<T extends string = Hook> {
  id: string;
  name: string;
  description: string;
  hooks: HookMap<T>;
}

export type { HookMap, Hook } from '../core/hooks.ts';
