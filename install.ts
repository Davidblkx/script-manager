import { parseFlags } from 'cliffy/flags/mod.ts'
import { buildCommand } from './src/cli.ts';

const parsed = parseFlags(Deno.args);
if (Deno.args.length === 1 && (parsed.flags.init || parsed.flags.finit)) {
  Deno.exit(0);
}

const cmd = await buildCommand();
if (cmd) {
  await cmd.parse(Deno.args);
}
