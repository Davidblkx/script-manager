import { ensureDir } from 'deno/fs/ensure_dir.ts';
import { Confirm, Input } from 'cliffy/prompt/mod.ts';
import { tty } from 'cliffy/ansi/mod.ts';
import { join } from 'deno/path/mod.ts';
import { getFileInfo } from '../../modules/utils/file.ts';

import type { RootCommand, RootOptions } from './__.ts';

import { CliSMX } from '../cli-smx.ts';
import { GitStatus } from "../../modules/git.ts";
import { logger } from '../../modules/logger.ts';

export function init(cmd: RootCommand) {
  cmd.command('init')
    .description('Initialize script folder')
    .option('--ignore', 'Create .gitignore file')
    .option('-m, --message <string>', 'Initial commit message')
    .option('-o, --origin <string>', 'Initial commit origin')
    .option('-f, --force', 'Non-interactive mode')
    .option('--clone <url:string>', 'Clone repository')
    .action(initAction);
}

interface InitOptions extends RootOptions {
  ignore?: boolean;
  message?: string;
  origin?: string;
  force?: boolean;
  clone?: string;
}

async function initAction(o: InitOptions) {
  const path = CliSMX.config.globalFile?.config.path;
  if (!path) {
    CliSMX.logger.error('No global file found');
    Deno.exit(1);
  }

  if (o.clone) {
    logger.debug('Cloning repository');
    await CliSMX.git.clone(o.clone);
    await CliSMX.git.checkout();
    tty.text('Script folder was cloned from: ' + o.clone);
  }

  await initTargets(path, o);

  if (o.clone) { Deno.exit(0); }

  let status = await initGit(path, o);
  status = await firstCommit(status, o);
  status = await setOrigin(status, o);
}

async function initTargets(path: string, o: InitOptions) {
  const targets = CliSMX.config.localFile?.config.targets ?? {};
  const targetsIds = Object.keys(targets);
  const toInit: string[] = [];

  for (const id of targetsIds) {
    const dirPath = join(path, id);
    const info = await getFileInfo(dirPath);
    if (!info) {
      toInit.push(dirPath);
    }
  }

  if (toInit.length === 0) {
    return;
  }

  if (!o.force) {
    const confirm = await Confirm.prompt({
      message: `Initialize ${toInit.length} target(s)?`,
      default: true,
    });
    if (!confirm) { return; }
  }

  CliSMX.logger.debug('Initializing targets');
  for (const path of toInit) {
    CliSMX.logger.debug(`Initializing target: ${path}`);
    await ensureDir(path);
  }
}

async function initGit(path: string, o: InitOptions) {
  const status = await CliSMX.git.status();

  if (status.isGit) { return status; }

  if (!o.force) {
    const confirm = await Confirm.prompt({
      message: `Initialize git repository in ${path}?`,
      default: true,
    });
    if (!confirm) { return Deno.exit(0); }
  }

  CliSMX.logger.debug('Initializing git repository');
  return await CliSMX.git.init();
}

async function firstCommit(status: GitStatus, o: InitOptions) {
  const hasFirstCommit = await CliSMX.git.hasCommit();
  if (hasFirstCommit) { return status; }

  let message = o.message;
  if (!message && !o.force) {
    message = await Input.prompt({
      message: 'Initial commit message',
      default: 'Initial commit',
    });
  }

  return await CliSMX.git.commit(message ?? 'Initial commit');
}

async function setOrigin(status: GitStatus, o: InitOptions) {
  if (o.clone) { return status; }
  const remote = await CliSMX.git.getOrigin();
  if (remote && !o.origin) { return status; }
  if (remote && remote === o.origin) { return status; }

  let origin = o.origin;
  if (!origin && !o.force) {
    origin = await Input.prompt({
      message: 'Remote repository URL',
    });
  }

  if (!origin) {
    CliSMX.logger.warning('No remote repository URL provided');
    return status;
  }

  CliSMX.logger.debug('Setting origin');
  await CliSMX.git.setOrigin(origin);
  await CliSMX.git.checkout();
  const fetchStatus = await CliSMX.git.fetch();
  if (fetchStatus.canPush) {
    await CliSMX.git.push();
  }
  return await CliSMX.git.status();
}
