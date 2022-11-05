import { createSection, createKeys } from '../settings.ts';

export type TargetSettings = {
  'targets.default': string;
}

export const targetSection = createSection<TargetSettings>();
export const targetKeys = createKeys<TargetSettings>();
