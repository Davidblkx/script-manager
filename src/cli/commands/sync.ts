import { tty, colors } from 'cliffy/ansi/mod.ts';
import { CliSMX } from '../cli-smx.ts';
import type { RootCommand, RootOptions } from './__.ts';

export function sync(cmd: RootCommand) {
  cmd.command('sync')
    .description('Sync script folder')
    .option('--no-commit', 'Do not commit changes')
    .option('--no-push', 'Print table without border')
    .option('--no-pull', 'Print table without border')
    .option('--force-pull', 'Pull even if there are local changes')
    .option('--force-push', 'Override remote changes')
    .option('--no-remote', 'Do not pull or push')
    .option('-m, --message <message>', 'Sync message')
    .action(syncAction);
}

interface SyncOptions extends RootOptions {
  noCommit?: boolean;
  noPush?: boolean;
  noPull?: boolean;
  forcePull?: boolean;
  forcePush?: boolean;
  noRemote?: boolean;
  message?: string;
}

async function syncAction(o: SyncOptions) {
  let status = o.noRemote
    ? await CliSMX.git.status()
    : await CliSMX.git.fetch();

  const actionRequired = (status.dirty && !o.noCommit)
    || (status.ahead > 0 && !o.noPush)
    || (status.behind > 0 && !o.noPull);

  if (!actionRequired) {
    tty.text(colors.green('Nothing to do\n'));
    return;
  }

  if (status.dirty && !o.noCommit) {
    CliSMX.logger.debug('Committing changes');
    const message = o.message || `Sync ${new Date().toISOString()}`;
    status = await CliSMX.git.commit(message);
    tty.text(colors.green('Changes were committed\n'));
  }

  if (status.canPull && !o.noPull && !o.noRemote) {
    CliSMX.logger.debug('Pulling changes');
    status = await CliSMX.git.pull(o.forcePull);
    tty.text(colors.green('Local update completed\n'));
  }

  if (status.canPush && !o.noPush && !o.noRemote) {
    CliSMX.logger.debug('Pushing changes');
    status = await CliSMX.git.push(o.forcePush);
    tty.text(colors.green('Remote update completed\n'));
  }
}
