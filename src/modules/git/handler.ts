import type { IRunProcess } from '../infra/run-process.ts';
import type { IGitHandler, GitStatus } from './models.ts';
import { parseGitStatus } from './parser.ts';
import { logger } from '../logger.ts';
import { getFolder } from '../utils/file.ts';

export class GitHandler implements IGitHandler {
  #runner: IRunProcess;
  #path: string;
  #online = true;
  #init = false;
  #branch: string;

  get online() {
    return this.#online;
  }

  get initialized() {
    return this.#init;
  }

  constructor({
    runner,
    path,
    branch,
  }: {
    runner: IRunProcess;
    path: string;
    branch: string;
  }) {
    this.#runner = runner;
    this.#path = path;
    this.#branch = branch;
  }

  async status(): Promise<GitStatus> {
    const gitArgs = ['git', 'status', '--porcelain', '--branch', '--ahead-behind'];
    const res = await this.#runner.run(gitArgs, this.#path);
    const status = parseGitStatus(res.stdout, res.stderr);
    this.#init = status.isGit;
    return status;
  }

  async checkout(): Promise<GitStatus> {
    const status = await this.status();
    if (status.branch === this.#branch) {
      return status;
    }

    const gitArgs = ['git', 'checkout', this.#branch];
    const res = await this.#runner.run(gitArgs, this.#path);
    if (!res.success) {
      logger.error(`Failed to checkout branch ${this.#branch} in ${this.#path}`);
      logger.error(res.stderr);
      Deno.exit(1);
    }

    return this.status();
  }

  async init(): Promise<GitStatus> {
    const status = await this.status();
    if (status.isGit) {
      logger.warning(`Repository already initialized in ${this.#path}`);
      return status;
    }

    const res = await this.#runner.run(['git', 'init'], this.#path);
    if (!res.success) {
      logger.error(`Failed to initialize repository in ${this.#path}`);
      logger.error(res.stderr);
      Deno.exit(1);
    }

    return this.status();
  }

  async commit(message: string): Promise<GitStatus> {
    const status = await this.status();
    if (!status.dirty) {
      logger.debug(`No changes to commit in ${this.#path}`);
      return status;
    }

    const addRes = await this.#runner.run(['git', 'add', '-A'], this.#path);
    if (!addRes.success) {
      logger.error(`Failed to add changes in ${this.#path}`);
      logger.error(addRes.stderr);
      Deno.exit(1);
    }

    const commitRes = await this.#runner.run(['git', 'commit', '-m', message], this.#path);
    if (!commitRes.success) {
      logger.error(`Failed to commit changes in ${this.#path}`);
      logger.error(commitRes.stderr);
      Deno.exit(1);
    }

    return this.status();
  }

  async push(force?: boolean): Promise<GitStatus> {
    const status = await this.status();
    if (!status.canPush) {
      logger.debug(`No changes to push in ${this.#path}`);
      return status;
    }

    const gitArgs = ['git', 'push', '-u', 'origin', this.#branch];
    if (force) {
      gitArgs.push('--force');
    }

    const res = await this.#runner.run(gitArgs, this.#path);
    if (!res.success) {
      logger.error(`Failed to push changes in ${this.#path}`);
      logger.error(res.stderr);
      Deno.exit(1);
    }

    return this.status();
  }

  async pull(force?: boolean): Promise<GitStatus> {
    const status = await this.status();
    if (status.dirty) {
      logger.error(`Cannot pull changes in ${this.#path} because you have pending changes`);
      return status;
    }

    if (!status.canPull) {
      logger.debug(`No changes to pull in ${this.#path}`);
      return status;
    }

    const gitArgs = ['git', 'pull'];
    if (force) {
      gitArgs.push('--force');
    }

    const res = await this.#runner.run(gitArgs, this.#path);
    if (!res.success) {
      logger.error(`Failed to pull changes in ${this.#path}`);
      logger.error(res.stderr);
      Deno.exit(1);
    }

    return this.status();
  }

  async reset(): Promise<GitStatus> {
    const status = await this.status();
    if (!status.dirty) {
      logger.debug(`No changes to reset in ${this.#path}`);
      return status;
    }

    const res = await this.#runner.run(['git', 'reset', '--hard'], this.#path);
    if (!res.success) {
      logger.error(`Failed to reset changes in ${this.#path}`);
      logger.error(res.stderr);
      Deno.exit(1);
    }

    return this.status();
  }

  async fetch(): Promise<GitStatus> {
    const res = await this.#runner.run(['git', 'fetch'], this.#path);
    if (!res.success) {
      logger.error(`Failed to fetch changes in ${this.#path}`);
      logger.error(res.stderr);
      Deno.exit(1);
    }

    return this.status();
  }

  async setOrigin(url: string): Promise<GitStatus> {
    const remote = await this.getOrigin();
    const args = !remote ? ['git', 'remote', 'add', 'origin', url] : ['git', 'remote', 'set-url', 'origin', url];

    const res = await this.#runner.run(args, this.#path);
    if (!res.success) {
      logger.error(`Failed to set origin in ${this.#path}`);
      logger.error(res.stderr);
      Deno.exit(1);
    }

    return this.status();
  }

  async getOrigin(): Promise<false | string> {
    const res = await this.#runner.run(['git', 'remote', 'get-url', 'origin'], this.#path);
    if (!res.success) {  return false; }
    return res.stdout.trim();
  }

  async clone(url: string): Promise<GitStatus> {
    const parent = getFolder(this.#path);
    const res = await this.#runner.run(['git', 'clone', url], parent);
    if (!res.success) {
      logger.error(`Failed to clone ${url} in ${parent}`);
      logger.error(res.stderr);
      Deno.exit(1);
    }

    return this.status();
  }

  async hasCommit(): Promise<boolean> {
    const res = await this.#runner.run(['git', 'rev-parse', 'HEAD'], this.#path);
    return res.success;
  }
}
