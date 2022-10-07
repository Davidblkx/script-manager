import { rootCommand } from '../sub-command.ts';
import { listCommands } from '../../units.ts'

export function registerListExecuteCommand() {
  rootCommand
    .createSubCommand('execute-list', 'List available commands', cmd =>
      cmd.alias('x-list')
        .option('-u, --unit <unit:string>', 'Unit id or name to execute command on')
        .action(async (opt) => await listCommands(opt.unit))
    );
}
