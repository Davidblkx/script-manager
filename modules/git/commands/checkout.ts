import { buildSpec, toResult } from '../utils.ts';

export type CheckoutParams = {
  branch: string;
  b?: boolean;
  B?: boolean;
};

export type CheckoutResult =  {
  /** Current branch name */
  branch: string;
  /** True, if branch was created */
  created: boolean;
}

export const checkout = buildSpec('checkout', { branch: 'master' } as CheckoutParams, (result) => {
  const success = result.stdout.includes(`branch '${result.command.branch}'`);
  const created = result.stdout.includes(`new branch '${result.command.branch}'`);

  if (!success) return result;

  return toResult(result, {
    branch: result.command.branch?.toString() || '',
    created,
  } as CheckoutResult);
});
