import type { GitResult, GitStatus, IGit, IGitHandler } from './models.ts';

export class Git implements IGit {
  #handler: IGitHandler;

  constructor(handler: IGitHandler) {
    this.#handler = handler;
  }

  async status(cwd?: string): Promise<GitStatus> {
    const res = await this.#handler.runCommand({ cmd: 'status' }, cwd);

    if (res.data) {
      return res.data;
    }

    throw new Error(`Git status failed: ${res.stderr}`);
  }

  async isGit(cwd?: string): Promise<boolean> {
    const res = await this.#handler.run({
      params: {
        cmd: 'rev-parse',
        isInsideWorkTree: true,
      },
      parser: (res) => {
        res.data = res.stdout === 'true';
        return res as GitResult<boolean>;
      },
    }, cwd);

    return !!res.data;
  }

  async checkout(branch: string, create?: boolean, cwd?: string): Promise<GitStatus> {
    const res = await this.#handler.runCommand({
      cmd: 'checkout',
      branch,
      b: create,
    }, cwd);

    if (!res.data) {
      throw new Error(`Git checkout failed: ${res.stderr}`);
    }

    if (!res.data.created && create) {
      throw new Error(`Git checkout failed: branch ${branch} already exists`);
    }

    return this.status(cwd);
  }
}
