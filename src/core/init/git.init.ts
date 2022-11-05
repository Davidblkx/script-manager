import { IConfigHandler } from "../../modules/config.ts";
import { GitHandler, GitSettings, IGitHandler } from "../../modules/git.ts";
import { IRunProcess } from '../../modules/infra/run-process.ts';
import { ISection } from "../../modules/settings.ts";

export function initGitHandler(config: IConfigHandler, settings: ISection<GitSettings>, runner: IRunProcess): IGitHandler {
  const path = config.globalFile?.config.path ?? '';
  const branch = (settings.value['git.branch'] ?? 'master').toString();

  return new GitHandler({
    runner,
    path,
    branch,
  });
}
