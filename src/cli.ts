import { Command } from 'cliffy/command/mod.ts';

export function buildCommand() {
  return new Command()
    .name('smx')
    .version('0.1.0')
    .description('A simple CLI to sync scripts from a remote repository.');
}
