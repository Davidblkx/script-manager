import type { SmxCommand } from '../cli.ts';

import { registerRuntimeCommands } from './runtime.ts';
import { registerRepoCommand } from './repo.ts';

let hasRegisteredCommands = false;

export function registerCommands(command: SmxCommand) {
  if (hasRegisteredCommands) return;
  hasRegisteredCommands = true;

  registerRuntimeCommands(command);
  registerRepoCommand(command);
}
