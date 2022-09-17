import { SMXEngine } from '../../modules/engine.ts';
import { GitRepo } from '../../modules/git.ts';
import { parseGitStatus } from '../../utils/git.ts';

export async function getRemote(engine: SMXEngine) {
  const repo = new GitRepo(engine.config.repo);
  try {
    const remote = await repo.getRemote();
    console.log(remote);
  } catch {
    console.error('No remote defined');
  }
}

export async function setRemote(engine: SMXEngine, remote: string) {
  const repo = new GitRepo(engine.config.repo);
  const res = await repo.setRemote(remote);
  if (res.success) {
    console.log(`Remote set to ${remote}`);
  } else {
    console.error(res.stderr);
  }
}

export async function checkRemoteSyncStatus(engine: SMXEngine) {
  const repo = new GitRepo(engine.config.repo);
  const res = await repo.status();
  try {
    const statusInfo = parseGitStatus(res.stdout);
    if (!statusInfo.remote) {
      if (await repo.hasRemote()) {
        console.log('Remote was never updated');
      } else {
        console.error('No remote defined');
      }
    } else if (statusInfo.status === 'synced') {
      console.log('Remote is synced');
    } else {
      console.log(`There are changes pending to sync with remote`);
    }

  } catch {
    console.error('Failed to parse git status');
  }
}
