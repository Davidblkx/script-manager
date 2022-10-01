import { registerConfigCommand } from './config.ts';
import { registerTargetCommands } from './target.ts';

export function registerCoreCommands() {
  registerConfigCommand();
  registerTargetCommands();
}
