import { registerMainExecuteCommand } from './main.ts';
import { registerListExecuteCommand } from './list.ts';

export function registerExecuteCommand() {
  registerMainExecuteCommand();
  registerListExecuteCommand();
}
