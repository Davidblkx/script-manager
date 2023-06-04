import { GitCommandParams, GitResult, GitCommandSpec } from "./models.ts";

export function buildSpec<
  C extends string,
  P extends GitCommandParams,
  T,
>(
  command: C,
  params: P,
  parser: (result: GitResult<P, C>) => GitResult<P, C, T | undefined> | Promise<GitResult<P, C, T | undefined>>
): GitCommandSpec<P, C, T> {
  return { command, params, parser } as unknown as GitCommandSpec<P, C, T>;
}

export function parseBranch(text: string) {
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

export function toResult<
C extends string,
P extends GitCommandParams,
T,
>(result: GitResult<P, C>, data?: T): GitResult<P, C, T> {
  return typeof data === 'undefined' ? {
    ...result,
  } : {
    ...result,
    data,
  };
}
