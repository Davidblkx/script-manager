import { join } from 'deno/path/mod.ts';
import { write } from 'tty';

import { getTargetById, buildTargetPath } from '../../../core/target.ts';
import { logger } from '../../../logger.ts';

export function getBinPath(targetId: string) {
  const target = getTargetById(targetId);
  if (!target) {
    logger.error('Could not find bin path for target: ' + targetId);
    return undefined;
  }

  const basePath = buildTargetPath(target);
  return join(basePath, 'bin');
}

export async function setExecutablePermissions(files: string[]) {
  const cmdRun = Deno.run({
    cmd: ['chmod', '+x', ...files],
    stdout: 'piped',
    stderr: 'piped',
  });

  const res = await cmdRun.status();
  if (!res.success) {
    const err = await cmdRun.stderrOutput();
    const errMessage = new TextDecoder().decode(err);
    logger.error(`Failed to set executable permissions on bin files.`);
    await write(errMessage, Deno.stdout);
  }
}
