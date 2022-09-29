import { registerConfigCommand } from './config.ts';
import { registerWhere } from './where.ts';
import { registerFolder } from './folder.ts';

export function registerCoreCommands() {
  registerConfigCommand();
  registerWhere();
  registerFolder();
}
