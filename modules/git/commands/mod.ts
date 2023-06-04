import { status } from './status.ts';
import { checkout } from './checkout.ts';
import { revParse, isGitRepo } from './rev-parse.ts';

export const GIT_SPEC = {
  status,
  checkout,
  'rev-parse': revParse,
  'is-git': isGitRepo,
}
