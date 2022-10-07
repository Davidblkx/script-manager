import type { Unit} from '../exports.ts';

import { init } from './init.ts';

export const BinUnit: Unit = {
  id: 'bin',
  name: 'Bin',
  description: 'Allows you to manage your bin folder.',
  hooks: {
    init,
  }
};
