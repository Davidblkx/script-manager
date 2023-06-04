import { buildSpec, toResult } from '../utils.ts';

export type RevParseParams = {
  isInsideWorkTree?: boolean;
};

export const revParse = buildSpec('rev-parse', {} as RevParseParams, (result) => {
  return toResult(result, result.stdout.trim());
});

export const isGitRepo = buildSpec('rev-parse', { isInsideWorkTree: true }, (result) => {
  return toResult(result, result.stdout.trim() === 'true');
});
