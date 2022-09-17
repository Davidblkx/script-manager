import { SMXEngine } from '../../modules/engine.ts';
import { GitRepo } from '../../modules/git.ts';
import { parseGitStatus } from '../../utils/git.ts';

export async function checkStatus(engine: SMXEngine) {
  const repo = new GitRepo(engine.config.repo);

  const status = await repo.status();
  if (!status.success) {
    console.error(status.stderr);
    return;
  }

  const remoteInfo = parseGitStatus(status.stdout);
  const toCommit = countChanges(status.stdout);

  console.log(`Changes to save: ${toCommit}`);
  if (remoteInfo.remote) {
    console.log(`Saves to sync with Remote: ${remoteInfo.remote}`);
  }
}

export async function commitChanges(engine: SMXEngine, message: string | undefined) {
  const repo = new GitRepo(engine.config.repo);

  const status = await repo.status();
  if (!status.success) { console.error(status.stderr); return; }

  const changesCount = countChanges(status.stdout);
  const commitMessage = message || `Saved ${changesCount} changes`;

  const res = await repo.commit(commitMessage);
  if (res.success) {
    console.log(`Changes committed: ${commitMessage}`);
  } else {
    console.error(res.stderr);
  }
}

function countChanges(status: string) {
  return status.split('\n').filter(e => e.trim().length > 0).length - 1;
}
