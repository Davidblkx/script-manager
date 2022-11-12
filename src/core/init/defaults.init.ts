import { InitOptions } from '../model.ts';
import { join } from 'deno/path/mod.ts';
import { LogLevel } from "../../modules/logger.ts";

export function buildDefaultOptions(): InitOptions {
  const homeDir = Deno.env.get('HOME') ?? Deno.env.get('USERPROFILE') ?? Deno.env.get('HOMEPATH') ?? Deno.cwd();
  const globalConfigPath = join(homeDir, '.smx.json');
  const localConfigPath = join(homeDir, '.smx');

  return {
    globalConfigPath,
    localConfigPath,
    initLocalPath: true,
    logLevel: LogLevel.info,
    quiet: false,
  }
}
