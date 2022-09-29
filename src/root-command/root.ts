import { CommandBuilder, buildBaseCommand } from './sub-command.ts';

export class RootCommand {
  // deno-lint-ignore no-explicit-any
  #subs: CommandBuilder<any>[] = [];

  // deno-lint-ignore no-explicit-any
  addSubCommand<T extends CommandBuilder<any>>(sub: T) {
    this.#subs.push(sub);
  }

  createSubCommand<T>(name: string, desc: string, init: (cmd: ReturnType<typeof buildBaseCommand>) => T): CommandBuilder<T>
  createSubCommand(name: string, desc: string): CommandBuilder<ReturnType<typeof buildBaseCommand>>
  createSubCommand<T>(name: string, desc: string, init: (cmd: ReturnType<typeof buildBaseCommand>) => T = e => e as unknown as T): CommandBuilder<T> {
    const cmd = CommandBuilder.create(name, desc, init);
    this.addSubCommand(cmd);
    return cmd;
  }

  run() {
    const sub = this.#subs.find(s => s.canInvoke);
    if (sub) { return sub.parse(); }

    const root = buildBaseCommand('smx', 'A CLI to sync scripts from a remote repository.');
    for (const sub of this.#subs) {
      const name = sub.command.getName();
      const desc = sub.command.getDescription();
      root.command(name, desc);
    }
    root.parse(Deno.args);
  }
}
