import { SMXConfig } from './models.ts';

export type Hook = 'sync' | 'save' | 'clean' | 'status' | 'new' | 'init' | 'update';

export interface HookProps {
  config: SMXConfig;
  settings: Record<string, string>;
  target: string;
  args: string[];
  exclusive: boolean;
}

export type HookHandler = {
  dry: (props: HookProps) => Promise<void> | void;
  handler: (props: HookProps) => Promise<void> | void;
  help: () => Promise<string> | string;
}

export type HookMap<T extends string> = Partial<Record<T, HookHandler>>;
