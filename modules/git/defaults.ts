import type { GitGenericCommand, GitResult } from './models.ts';
import type { GitAction, GitActionRes, GitCommands } from './commands.ts';

export function buildDefaultCommands(): GitGenericCommand<unknown, unknown>[] {
  return [
    buildCommand({
      cmd: 'status',
      aheadBehind: true,
      branch: true,
      porcelain: true,
    }, (res) => {
      res.data = {
        ahead: 0,
        behind: 0,
        branch: '',
        changes: 0,
        dirty: false,
      };

      if (res.stderr.length) return res;

      const lines = res.stdout.split('\n');
      for (const line of lines) {
        if (line.startsWith('##')) {
          const data = parseBranch(line);
          res.data.branch = data.branch;
          res.data.ahead = data.ahead;
          res.data.behind = data.behind;
          res.data.remote = data.remote;
        } else if (line.length) {
          res.data.dirty = true;
          res.data.changes++;
        }
      }

      return res;
    }),

    buildCommand({
      cmd: 'checkout',
      branch: 'master',
    }, (res) => {
      const success = res.stdout.includes(`branch '${res.params.branch}'`);
      const created = res.stdout.includes(`new branch '${res.params.branch}'`);

      if (!success) return res;

      res.data = {
        branch: res.params.branch?.toString() || '',
        created,
      };

      return res;
    }),
  ];
}

function buildCommand<T extends GitCommands, K extends GitAction>(
  params: T & { cmd: K },
  parser: (res: GitResult<GitActionRes<K>>) => GitResult<GitActionRes<K>>,
): GitGenericCommand<T, GitActionRes<K>> {
  return {
    params,
    parser: (res) => parser(res as GitResult<GitActionRes<K>>),
  };
}

function parseBranch(text: string) {
  const match = text.match(
    /(?:##\s|)(?<branch>.*?)(?:\.\.\.|$)(?<remote>.*?)(?:\s|$)(?:.*ahead\s(?<ahead>\d)|)(?:.*behind\s(?<behind>\d)|)/,
  );
  return {
    branch: match?.groups?.branch || '',
    remote: match?.groups?.remote || undefined,
    ahead: parseInt(match?.groups?.ahead || '0', 10),
    behind: parseInt(match?.groups?.behind || '0', 10),
  };
}
