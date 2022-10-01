import { registerConfigCommand } from './config.ts';
import { registerTargetCommands } from './target.ts';
import { registerUnitsCommands } from './units.ts';

export function registerCoreCommands() {
  registerConfigCommand();
  registerTargetCommands();
  registerUnitsCommands();
}
