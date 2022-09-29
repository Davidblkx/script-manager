import { Command } from "cliffy/command/mod.ts";

import { version } from '../core/version.ts';
import { logger, LogLevel } from "../logger.ts";

export class CommandBuilder<T> {
  #command: T;
  #builders = new Set<(cmd: T) => void>();

  get canInvoke() {
    return this.command.getName() === Deno.args[0];
  }

  get command(): Command {
    return this.#command as unknown as Command;
  }

  private constructor(command: T) {
    this.#command = command;
  }

  apply(builder: (cmd: T) => void): this {
    this.#builders.add(builder);
    return this;
  }

  build(): Command {
    for (const builder of this.#builders) {
      builder(this.#command);
    }
    return this.command;
  }

  parse() {
    if (!this.canInvoke) {
      throw new Error("Cannot invoke this command");
    }

    const args = Deno.args.slice(1);
    return this.build().parse(args);
  }

  public static create<T>(name: string, desc: string, init: (cmd: ReturnType<typeof buildBaseCommand>) => T): CommandBuilder<T>
  public static create(name: string, desc: string): CommandBuilder<ReturnType<typeof buildBaseCommand>>
  public static create<T>(name: string, desc: string, init: (cmd: ReturnType<typeof buildBaseCommand>) => T = e => e as unknown as T): CommandBuilder<T> {
    const cmd = buildBaseCommand(name, desc);
    cmd.name(name).description(desc);
    cmd.version(version);
    return new CommandBuilder(init(cmd));
  }
}

export function buildBaseCommand(name: string, desc: string) {
  return new Command()
    .name(name)
    .description(desc)
    .version(version)
    .globalOption('-v, --verbose', 'Enable verbose logging', { action: () => logger.setLogLevel(LogLevel.all) })
    .globalOption('-q, --quiet', 'Disable logging', { action: () => logger.setLogLevel(LogLevel.disabled) })
}
