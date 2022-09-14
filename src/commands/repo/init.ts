import { write } from 'tty';
import { ensureDir } from 'deno/fs/mod.ts';
import { join } from 'deno/path/mod.ts';
import { SMXEngine } from '../../modules/engine.ts';
import { GitRepo } from '../../modules/git.ts';

export async function initRepo(engine: SMXEngine) {
  console.log(`Initializing repo: ${engine.config.repo}`);
  await ensureDir(engine.config.repo);

  await write("Initializing git repo...", Deno.stdout);

  const gitRepo = await initGitRepo(engine);
  if (gitRepo === 'NOOP') { await write('✅ Unchanged\n', Deno.stdout); }
  if (gitRepo === true) { await write('✅ Done\n', Deno.stdout); }
  if (gitRepo === false) { await write('❌ Failed\n', Deno.stdout); }

  for (const runtime of engine.listRuntimes) {
    await write(`Initializing runtime ${runtime.type}...`, Deno.stdout);
    const result = await runtime.init();
    if (result) { await write('✅ Done\n', Deno.stdout); }
    if (!result) { await write('❌ Failed\n', Deno.stdout); }
  }

  if (engine.config.global) {
    await write('Initializing global config...', Deno.stdout);
    const result = await initGlobalConfig(engine);
    if (result) { await write('✅ Done\n', Deno.stdout); }
    if (!result) { await write('❌ Failed\n', Deno.stdout); }
  }
}

async function initGitRepo(engine: SMXEngine): Promise<boolean | 'NOOP'> {
  const repo = new GitRepo(engine.config.repo);

  if (await repo.isGitRepo()) { return 'NOOP'; }

  const result = await repo.init();
  return result.success;
}

async function initGlobalConfig(engine: SMXEngine): Promise<boolean> {
  const binPath = join(engine.config.repo, 'bin');
  await ensureDir(binPath);

  // TODO: add bin to global path, should work on windows and linux

  return true;
}
