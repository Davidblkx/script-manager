import type { GitGenericCommand, GitResult, IGitCommandBuilder, IGitHandler } from './models.ts';
import type { ILoggerFactory, Logger } from '../logger/mod.ts';
import type { ISubprocessFactory } from '../subprocess/mod.ts';
import type { GitAction, GitActionRes, GitCommands } from './commands.ts';

export class GitHandler implements IGitHandler {
  #builder: IGitCommandBuilder;
  #runner: ISubprocessFactory;
  #logger: Logger;

  constructor(loggerFactory: ILoggerFactory, builder: IGitCommandBuilder, subprocessFactory: ISubprocessFactory) {
    this.#logger = loggerFactory.get('git_handler');
    this.#builder = builder;
    this.#runner = subprocessFactory;
  }

  runCommand<T extends GitCommands, K extends GitAction>(
    command: T & { cmd: K },
    cwd?: string,
  ): Promise<GitResult<GitActionRes<K>>> {
    const cmd = this.#builder.buildCommand<T, K>(command);
    return this.run(cmd, cwd);
  }

  runCustom<P, R>(command: P & { cmd: string }, cwd?: string): Promise<GitResult<R>> {
    const cmd = this.#builder.build<P, R>(command);
    return this.run(cmd, cwd);
  }

  async run<P, R>(command: GitGenericCommand<P, R>, cwd?: string): Promise<GitResult<R>> {
    const args: string[] = [command.params.cmd];

    for (const [key, value] of Object.entries(command.params)) {
      if (key === 'cmd') continue;
      if (typeof value === 'undefined') continue;
      if (typeof value === 'boolean' && !value) continue;

      if (key.length === 1) {
        args.push(`-${key}`);
        continue;
      }

      const argName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      args.push(argName.startsWith('-') ? `-${argName}` : `--${argName}`);

      if (typeof value !== 'boolean') {
        args.push(value.toString());
      }
    }

    const res = await this.runRaw(args, cwd);

    if (res.stderr.length) {
      this.#logger.debug(`Command ${command.params.cmd} failed with stderr: ${res.stderr}`);
    }

    return command.parser({
      ...res,
      params: command.params,
    });
  }

  async runRaw(args: string[], cwd: string = Deno.cwd()): Promise<{ stdout: string; stderr: string; code: number }> {
    this.#logger.debug(`Running raw command: git ${args.join(' ')}`);

    try {
      return await this.#runner.exec({
        target: "git",
        runOptions: {
          args,
          cwd,
        },
        handler: (proc) => ({
          code: proc.code,
          stderr: proc.stderr ?? "",
          stdout: proc.stdout ?? "",
        }),
      });
    } catch (ex) {
      const error = getError(ex);
      this.#logger.error(error);

      return {
        code: -1,
        stdout: '',
        stderr: '',
      };
    }
  }
}

function getError(ex: unknown): Error {
  if (ex instanceof Error) {
    return ex;
  }

  if (typeof ex === 'string') {
    return new Error(ex);
  }

  return new Error('Unknown error');
}
