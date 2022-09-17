import { join } from 'deno/path/mod.ts';

export interface GitOpResult {
  success: boolean;
  code: number;
  stdout: string;
  stderr: string;
}

function fail(message?: string): GitOpResult {
  return {
    success: false,
    code: -1,
    stdout: '',
    stderr: message ?? '',
  }
}

export class GitRepo {
  #root: string;
  #branch = 'master';
  #remote = 'origin';

  constructor(root: string) {
    this.#root = root;
  }

  public async setBranch(branch: string): Promise<GitOpResult> {
    if (await this.isGitRepo()) { return fail('repo not initialized'); }
    if (await this.getBranch() === branch) { return fail('branch is current branch'); }

    const result = await this.executeGitCommand('checkout', '-b', branch);
    return result;
  }

  public async getBranch() {
    const result = await this.executeGitCommand('branch', '--show-current');
    return result.stdout.trim();
  }

  public async getRemote() {
    const result = await this.executeGitCommand('remote', 'get-url', this.#remote);
    if (!result.success) { throw new Error(result.stderr); }
    return result.stdout.trim();
  }

  public async setRemote(remote: string) {
    if (await this.hasRemote() && await this.getRemote() === remote) { return fail('remote is current remote'); }

    const result = await this.executeGitCommand('remote', 'add', this.#remote, remote);
    return result;
  }

  public fetch() {
    return this.executeGitCommand('fetch', '-q');
  }

  public status() {
    return this.executeGitCommand('status', '--porcelain', '-b');
  }

  public async hasRemote() {
    const result = await this.executeGitCommand('remote', 'get-url', this.#remote);
    return result.success;
  }

  public async isGitRepo(): Promise<boolean> {
    const result = await this.executeGitCommand('status');
    return result.success;
  }

  public async init(readme?: string): Promise<GitOpResult> {
    if (await this.isGitRepo()) { return fail('repo already initialized'); }

    const readmeContent = readme || `# My scripts and dotfiles`;
    const readMe = join(this.#root, 'README.md');
    await Deno.writeTextFile(readMe, readmeContent);

    const result = await this.executeGitCommand('init', '-b', this.#branch);
    if (!result.success) { return result; }

    await this.executeGitCommand('add', '-A');
    return await this.executeGitCommand('commit', '-m', 'Initial commit');
  }

  public async commit(message: string): Promise<GitOpResult> {
    const addOp = await this.executeGitCommand('add', '-A');
    if (!addOp.success) { return addOp; }

    return await this.executeGitCommand('commit', '-m', message);
  }

  async executeGitCommand(...params: string[]) {
    const process = Deno.run({
      cmd: ['/usr/bin/git', ...params],
      stdout: 'piped',
      stderr: 'piped',
      stdin: 'inherit',
      cwd: this.#root,
    });

    const status = await process.status();

    const stdout = new TextDecoder().decode(await process.output());
    const stderr = new TextDecoder().decode(await process.stderrOutput());

    return {
      success: status.success,
      code: status.code,
      stdout,
      stderr,
    }
  }
}
