import { buildRootCommand } from './src/cli.ts';

const cmd = await buildRootCommand();
await cmd.run();
