import type { GitStatus } from './models.ts';

export function parseGitStatus(out: string, err?: string): GitStatus {
  const status: GitStatus = {
    dirty: false,
    ahead: 0,
    behind: 0,
    changes: 0,
    canPull: false,
    canPush: false,
    isGit: false,
    branch: '',
  };

  if (err?.length) { return status; }
  status.isGit = true;

  const lines = out.split('\n')
  for (const line of lines) {
    if (line.startsWith('##')) {
      const res = parseBranch(line);
      status.branch = res.branch;
      status.ahead = res.ahead;
      status.behind = res.behind;
      status.remote = res.remote;
    } else if (line.length) {
      status.dirty = true;
      status.changes++;
    }
  }

  status.canPull = status.behind > 0 && !status.dirty;
  status.canPush = status.ahead > 0 || !status.remote;

  return status;
}

function parseBranch(text: string) {
  const match = text.match(/(?:##\s|)(?<branch>.*?)(?:\.\.\.|$)(?<remote>.*?)(?:\s|$)(?:.*ahead\s(?<ahead>\d)|)(?:.*behind\s(?<behind>\d)|)/);
  return {
    branch: match?.groups?.branch || '',
    remote: match?.groups?.remote || undefined,
    ahead: parseInt(match?.groups?.ahead || '0', 10),
    behind: parseInt(match?.groups?.behind || '0', 10),
  }
}
