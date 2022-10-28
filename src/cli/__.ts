import { buildRootCommand } from './root.ts';

import { commands } from './commands/__.ts';
import { cliPlugins } from './plugins.ts';
export { cliPlugins } from './plugins.ts';

export async function initCli() {
  const cmd = buildRootCommand();

  for (const loader of commands) {
    await loader(cmd);
  }

  for (const loader of cliPlugins.value) {
    await loader(cmd);
  }

  await cmd.parse(Deno.args);
}
