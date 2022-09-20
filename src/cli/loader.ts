import { SmxCommand } from "../cli.ts";
import { registerCoreCommands } from './core/__.ts';

export function registerCommands(cmd: SmxCommand) {
  registerCoreCommands(cmd);
}
