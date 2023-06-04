import { ILoggerFactory, Logger } from "../logger/mod.ts";
import { ISubprocessFactory } from "../subprocess/mod.ts";
import { GIT_SPEC, InternalGitSpec } from "./default-spec.ts";
import { GitSpec, IGit, IGitSpecRunner, GitCommandSpec, GitResult, GitCommandParams } from "./models.ts";
import { GitSpecRunner } from "./spec-runner.ts";

export class Git implements IGit {
  #log: Logger;
  spec: IGitSpecRunner<InternalGitSpec>;
  #runner: ISubprocessFactory;

  constructor(
    loggerFactory: ILoggerFactory,
    subprocessFactory: ISubprocessFactory
  ) {
    this.#log = loggerFactory.get("git");
    this.#runner = subprocessFactory;
    this.spec = new GitSpecRunner(this, GIT_SPEC);
  }

  createSpecRunner<T extends GitSpec>(spec: T): IGitSpecRunner<T> {
    return new GitSpecRunner(this, spec);
  }

  async run<P extends GitCommandParams, C extends string, T = unknown>(spec: GitCommandSpec<P, C, T>, cwd?: string): Promise<GitResult<P, C, T | undefined>> {
    const args: string[] = [spec.command];

    for (const [key, value] of Object.entries(spec.params)) {
      if (key === "cmd") continue;
      if (typeof value === "undefined") continue;
      if (typeof value === "boolean" && !value) continue;

      if (key.length === 1) {
        args.push(`-${key}`);
        continue;
      }

      const argName = key.replace(/([A-Z])/g, "-$1").toLowerCase();
      args.push(argName.startsWith("-") ? `-${argName}` : `--${argName}`);

      if (typeof value !== "boolean" && isDefined<number>(value)) {
        args.push(value.toString());
      }
    }

    const res = await this.raw(args, cwd);

    if (res.stderr.length) {
      this.#log.debug(
        `Command ${spec.command} failed with stderr: ${res.stderr}`
      );
    }

    return await spec.parser({
      ...res,
      command: {
        cmd: spec.command,
        ...spec.params,
      },
    } as unknown as GitResult<P, C>);
  }

  async raw(args: string[], cwd = Deno.cwd()): Promise<{ stdout: string; stderr: string; code: number }> {
    this.#log.debug(`Running raw command: git ${args.join(" ")}`);

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
      this.#log.error(error);

      return {
        code: -1,
        stdout: "",
        stderr: "",
      };
    }
  }
}

function getError(ex: unknown): Error {
  if (ex instanceof Error) {
    return ex;
  }

  if (typeof ex === "string") {
    return new Error(ex);
  }

  return new Error("Unknown error");
}

function isDefined<T>(value: unknown): value is T {
  return typeof value !== "undefined" && typeof value !== "object";
}
