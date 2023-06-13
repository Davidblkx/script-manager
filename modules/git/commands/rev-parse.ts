import { buildCommandSpec } from '../../aif/mod.ts';

export type RevParseParams = {
  isInsideWorkTree?: boolean;
  gitDir?: string;
};

export const revParse = buildCommandSpec('rev-parse', {} as RevParseParams, (r) => r);

export const isGitRepo = buildCommandSpec(
  'rev-parse',
  { isInsideWorkTree: true },
  (res) => res.stdout?.trim() === 'true',
);
