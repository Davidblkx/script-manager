import { registerConfigCommand } from './config.ts';
import { registerWhere } from './where.ts';
import { registerFolder } from './folder.ts';
import { registerEditor } from './editor.ts';

export function registerCoreCommands() {
  registerConfigCommand();
  registerWhere();
  registerFolder();
  registerEditor();
}
