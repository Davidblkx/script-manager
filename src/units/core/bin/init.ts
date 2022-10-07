import { write } from 'tty';
import { join } from 'deno/path/mod.ts';
import { ensureDir } from 'deno/fs/mod.ts';

import { HookHandler, HookProps } from '../exports.ts';
import { logger } from '../../../logger.ts';
import { getTargetById, buildTargetPath } from '../../../core/target.ts';
import { getHomeDirectory } from '../../../utils/config.ts';
import { getFileInfo } from '../../../utils/file.ts';

const SEGMENT_START = '### SMX -- START --';
const SEGMENT_END = '### SMX -- END --';

export const init: HookHandler = {
  help: () => 'Initializes the bin folder.',
  dry,
  handler,
}

async function handler(props: HookProps) {
  logger.debug('Initializing bin folder.');
  const binPath = getBinPath(props.target);
  if (!binPath) {
    logger.error('Could not find bin path for target: ' + props.target);
    return;
  }

  logger.debug(`Creating bin folder at ${binPath}.`);
  await ensureDir(binPath);

  const shellList = await checkShellList();

  if (shellList.pwsh) {
    logger.debug(`Adding bin folder to PowerShell profile at ${shellList.pwsh}.`);
    addBinPathPwsh(shellList.pwsh, binPath);
  }

  if (shellList.bash) {
    logger.debug(`Adding bin folder to Bash profile at ${shellList.bash}.`);
    addBinPathBash(shellList.bash, binPath);
  }

  if (shellList.zsh) {
    logger.debug(`Adding bin folder to Zsh profile at ${shellList.zsh}.`);
    addBinPathZsh(shellList.zsh, binPath);
  }

  if (shellList.fish) {
    logger.debug(`Adding bin folder to Fish profile at ${shellList.fish}.`);
    addBinPathFish(shellList.fish, binPath);
  }

  if (shellList.nu) {
    logger.debug(`Adding bin folder to Nu profile at ${shellList.nu}.`);
    addBinPathNu(shellList.nu, binPath);
  }
}

async function dry(props: HookProps) {
  const binPath = getBinPath(props.target);
  if (!binPath) {
    logger.error('Could not find bin path for target: ' + props.target);
    return;
  }

  const folderInfo = await getFileInfo(binPath);
  if (!folderInfo) {
    await write(`Create folder at: ${binPath}.\n`, Deno.stdout);
  }

  const shellList = await checkShellList();

  const hasAnyShell = Object.values(shellList).some((shell) => shell !== false);
  if (!hasAnyShell) { return; }

  await write('Add bin folder to PATH in shell:\n', Deno.stdout);

  if (shellList.pwsh) {
    await write(`  PowerShell: ${shellList.pwsh}\n`, Deno.stdout);
  }

  if (shellList.bash) {
    await write(`  Bash: ${shellList.bash}\n`, Deno.stdout);
  }

  if (shellList.zsh) {
    await write(`  Zsh: ${shellList.zsh}\n`, Deno.stdout);
  }

  if (shellList.fish) {
    await write(`  Fish: ${shellList.fish}\n`, Deno.stdout);
  }

  if (shellList.nu) {
    await write(`  Nu: ${shellList.nu}\n`, Deno.stdout);
  }
}

function getBinPath(targetId: string) {
  const target = getTargetById(targetId);
  if (!target) { return undefined; }

  const basePath = buildTargetPath(target);
  return join(basePath, 'bin');
}

interface ShellToUse {
  pwsh: false | string;
  bash: false | string;
  zsh: false | string;
  fish: false | string;
  nu: false | string;
}

async function checkShellList(): Promise<ShellToUse> {
  return {
    pwsh: await getPowershellProfileFile(),
    bash: await getBashProfileFile(),
    zsh: await getZshProfileFile(),
    fish: await getFishProfileFile(),
    nu: await getNuProfileFile(),
  };
}

function getPowershellProfileFile(): Promise<string | false> {
  return getPathFromCmd(['pwsh', '-c', "$profile"]);
}

async function getBashProfileFile(): Promise<string | false> {
  const bashProfilePath = join(getHomeDirectory(), '.bash_profile');

  const info = await getFileInfo(bashProfilePath);

  if (!info) {
    logger.debug('Could not find bash profile file.');
    return false;
  }

  return bashProfilePath;
}

async function getZshProfileFile(): Promise<string | false> {
  const zshProfilePath = join(getHomeDirectory(), '.zprofile');

  const info = await getFileInfo(zshProfilePath);

  if (!info) {
    logger.debug('Could not find zsh profile file.');
    return false;
  }

  return zshProfilePath;
}

async function getFishProfileFile(): Promise<string | false> {
  const fishProfilePath = join(getHomeDirectory(), '.config/fish/config.fish');

  const info = await getFileInfo(fishProfilePath);

  if (!info) {
    logger.debug('Could not find fish profile file.');
    return false;
  }

  return fishProfilePath;
}

function getNuProfileFile(): Promise<string | false> {
  return getPathFromCmd(['nu', '-c', "echo $nu.config-path"]);
}

async function getPathFromCmd(cmd: string[]): Promise<string | false> {
  const cmdName = cmd[0] ?? 'unknown';

  const cmdRun = Deno.run({
    cmd,
    stdout: 'piped',
    stderr: 'piped',
  });
  const res = await cmdRun.status();

  if (!res.success) {
    logger.debug(`Could not find ${cmdName} profile path.`);
    return false;
  }

  const out = await cmdRun.output();
  const err = await cmdRun.stderrOutput();

  if (err.length > 0) {
    logger.debug(`Could not find ${cmdName} profile path.`);
    return false;
  }

  const outString = new TextDecoder().decode(out);
  const path = outString.trim();

  const info = await getFileInfo(path);

  if (!info) {
    logger.debug(`Could not find path for ${cmdName} profile at ${path}.`);
    return false;
  }

  return path;
}

function getCleanFileContent(path: string) {
  const file = Deno.readTextFileSync(path);

  const start = file.indexOf(SEGMENT_START);
  const end = file.indexOf(SEGMENT_END);

  if (start === -1 || end === -1) {
    return file;
  }

  return file.substring(0, start) + file.substring(end + SEGMENT_END.length);
}

function addBinPathPwsh(path: string, binPath: string) {
  const output = getCleanFileContent(path);

  const addPathScript = `${SEGMENT_START}
$env:PATH = "${binPath};$env:PATH"
${SEGMENT_END}
`;

  Deno.writeTextFileSync(path, output + addPathScript);
}

function addBinPathBash(path: string, binPath: string) {
  const output = getCleanFileContent(path);

  const addPathScript = `${SEGMENT_START}
export PATH="${binPath}:$PATH"
${SEGMENT_END}
`;

  Deno.writeTextFileSync(path, output + addPathScript);
}

function addBinPathZsh(path: string, binPath: string) {
  const output = getCleanFileContent(path);

  const addPathScript = `${SEGMENT_START}
export PATH="${binPath}:$PATH"
${SEGMENT_END}
`;

  Deno.writeTextFileSync(path, output + addPathScript);
}

function addBinPathFish(path: string, binPath: string) {
  const output = getCleanFileContent(path);

  const addPathScript = `${SEGMENT_START}
set -gx PATH "${binPath}" $PATH
${SEGMENT_END}
`;

  Deno.writeTextFileSync(path, output + addPathScript);
}

function addBinPathNu(path: string, binPath: string) {
  const output = getCleanFileContent(path);

  const addPathScript = `${SEGMENT_START}
config set path $nu:path "${binPath}"
${SEGMENT_END}
`;

  Deno.writeTextFileSync(path, output + addPathScript);
}
