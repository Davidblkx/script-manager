import { buildCommand } from './src/cli.ts';

await buildCommand().parse(Deno.args);
