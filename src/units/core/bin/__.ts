import type { Unit} from '../exports.ts';

import { init } from './init.ts';
import { sync } from './sync.ts';
import { _new } from './new.ts';

export const BinUnit: Unit = {
  id: 'bin',
  name: 'Bin',
  description: 'Allows you to manage your bin folder.',
  hooks: {
    init,
    sync,
    new: _new,
  }
};
