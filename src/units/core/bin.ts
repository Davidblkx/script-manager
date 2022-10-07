import type { Unit} from '../models.ts';
import { write } from 'tty';

export const BinUnit: Unit = {
  id: 'bin',
  name: 'Bin',
  description: 'Allows you to manage your bin folder.',
  hooks: {
    init: {
      help: () => 'Initializes the bin folder.',
      dry: async () => await write('Would initialize bin folder.\n', Deno.stdout),
      handler: async () => await write('Initializing bin folder.\n', Deno.stdout),
    }
  }
};
