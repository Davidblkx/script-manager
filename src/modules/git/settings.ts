import { createSection } from '../settings.ts';

export type GitSettings = {
  'git.branch': string;
}

export const targetSection = createSection<GitSettings>();
