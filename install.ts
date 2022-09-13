import { parseFlags } from 'cliffy/flags/mod.ts'
import { buildCommand } from './src/cli.ts';
import { initialize } from './src/commands/initialize.ts';

const parsed = parseFlags(Deno.args);
if (parsed.flags.init || parsed.flags.forceInit) {
  await initialize(!!parsed.flags.forceInit);
  Deno.exit(0);
}

const cmd = await buildCommand();
if (cmd) {
  await cmd.parse(Deno.args);
}
