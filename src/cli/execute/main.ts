import { rootCommand } from '../sub-command.ts';
import { showHelpForCommands, dryRunCommand, executeCommand } from '../../units.ts'
import { HookProps } from '../../core/hooks.ts';
import { getConfig } from '../../core/config.ts';

export function registerMainExecuteCommand() {
  rootCommand
    .createSubCommand('execute', 'Execute a command', cmd =>
      cmd
        .helpOption(false)
        .alias('x')
        .option('-d, --dry-run', 'Show what would be done')
        .option('-u, --unit <unit:string>', 'Unit id or name to execute command on')
        .option('-h, --help', 'Show help for command')
        .arguments('<command:string> [args...:string]')
        .action(async (opt, cmd, ...args) => {
          if (opt.help) {
            await showHelpForCommands(cmd, opt.unit);
          } else {
            const config = getConfig();
            const props: HookProps = {
              args,
              config,
              target: config.default,
              settings: config.targets[config.default]?.settings ?? {},
              exclusive: !!opt.unit,
            }

            if (opt.dryRun) {
              await dryRunCommand(cmd, props, opt.unit);
            } else {
              await executeCommand(cmd, props, opt.unit);
            }
          }
        })
    );
}
