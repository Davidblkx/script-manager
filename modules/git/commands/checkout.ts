import { buildCommandSpec } from '../../aif/mod.ts';

export type CheckoutParams = {
  branch: string;
  b?: boolean;
  B?: boolean;
};

export const checkout = buildCommandSpec(
  'checkout',
  { branch: 'master' } as CheckoutParams,
  (result) => {
    const success = result.stdout?.includes(`branch '${result.spec.branch}'`);
    const created = result.stdout?.includes(`new branch '${result.spec.branch}'`);
    const branch = result.spec.branch;

    return { success, created, branch };
  },
);
