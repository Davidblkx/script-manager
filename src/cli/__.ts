import { ValidationError } from "cliffy/command/mod.ts";
import { buildRootCommand } from './root.ts';
import { CliSMX } from './cli-smx.ts';

import { commands } from './commands/__.ts';
import { cliPlugins } from './plugins.ts';
export { cliPlugins } from './plugins.ts';

export async function initCli() {
  await CliSMX.init();
  const cmd = buildRootCommand();

  for (const loader of commands) {
    await loader(cmd);
  }

  for (const loader of cliPlugins.value) {
    await loader(cmd);
  }

  try {
    await cmd.parse(Deno.args);
  } catch (err) {
    if (err instanceof ValidationError) {
      cmd.showHelp();
    } else {
      throw err;
    }
  }
}
