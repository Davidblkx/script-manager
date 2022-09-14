import { SMXEngine } from '../../modules/engine.ts';

export async function editRepoScripts(engine: SMXEngine) {
  const editor = engine.config.editor;
  const repo = engine.config.repo;

  const process = Deno.run({
    cmd: [editor, repo],
    stdout: 'piped',
    stderr: 'inherit',
  });

  await process.status();
}
