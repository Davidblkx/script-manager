import { IConfigHandler } from "../../modules/config.ts";
import { GitHandler, IGitHandler } from "../../modules/git.ts";
import { NamedSettings } from '../../modules/settings.ts';
import { IRunProcess } from '../../modules/infra/run-process.ts';

export function initGitHandler(config: IConfigHandler, named: NamedSettings, runner: IRunProcess): IGitHandler {
  const path = config.globalFile?.config.path ?? '';
  const branch = (named.git.branch ?? 'master').toString();

  return new GitHandler({
    runner,
    path,
    branch,
  });
}
