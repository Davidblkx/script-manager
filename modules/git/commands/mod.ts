import { status } from './status.ts';
import { checkout } from './checkout.ts';
import { isGitRepo, revParse } from './rev-parse.ts';

export const GIT_SPEC = {
  status,
  checkout,
  'rev-parse': revParse,
  'is-git-repo': isGitRepo,
};

export type GitSpec = typeof GIT_SPEC;
