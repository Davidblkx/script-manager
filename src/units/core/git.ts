import { write } from "tty";
import type { Unit } from '../models.ts';

export const GitUnit: Unit = {
  id: 'git',
  name: 'Git',
  description: 'Allows you to sync your settings with a git repository.',
  hooks: {
    init: {
      help: () => 'Initializes the git repository.',
      dry: async () => await write('Would initialize git repository.\n', Deno.stdout),
      handler: async () => await write('Initializing git repository.\n', Deno.stdout),
    }
  }
};
