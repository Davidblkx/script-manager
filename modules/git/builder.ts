import type { GitGenericCommand, IGitCommandBuilder } from './models.ts';
import type { ILoggerFactory, Logger } from '../logger/mod.ts';
import type { GitAction, GitActionRes, GitCommands } from './commands.ts';
import { buildDefaultCommands } from './defaults.ts';

export class GitCommandBuilder implements IGitCommandBuilder {
  #cmds: Map<string, GitGenericCommand<unknown, unknown>>;
  #logger: Logger;

  constructor(loggerFactory: ILoggerFactory, initialCommands?: GitGenericCommand<unknown, unknown>[]) {
    this.#logger = loggerFactory.get('git_command_builder');
    const cmdList = initialCommands ?? buildDefaultCommands();
    this.#cmds = new Map(cmdList.map((cmd) => [cmd.params.cmd, cmd]));
  }

  register<P, R>(command: GitGenericCommand<P, R>): void {
    this.#logger.debug(`Registering command ${command.params.cmd}`);

    if (this.#cmds.has(command.params.cmd)) {
      this.#logger.warning(`Command ${command.params.cmd} is already registered`);
    }

    this.#cmds.set(command.params.cmd, command);
  }

  buildCommand<T extends GitCommands, K extends GitAction>(
    command: T & { cmd: K },
  ): GitGenericCommand<T, GitActionRes<K>> {
    return this.build(command);
  }

  build<P, R>(command: P & { cmd: string }): GitGenericCommand<P, R>;
  build(command: unknown): GitGenericCommand<unknown, unknown> {
    if (!isCommand(command)) {
      this.#logger.debug(`Invalid command ${command}`);
      throw new Error('Invalid command');
    }

    const cmd = this.#cmds.get(command.cmd);
    if (!cmd) {
      const errMessage = `Command ${command.cmd} is not registered`;
      this.#logger.debug(errMessage);
      throw new Error(errMessage);
    }

    return {
      params: {
        ...cmd.params,
        ...command,
      },
      parser: cmd.parser,
    };
  }
}

function isCommand(cmd: unknown): cmd is GitCommands {
  return (cmd as GitCommands).cmd !== undefined;
}
