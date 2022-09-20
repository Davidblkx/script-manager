import type { SmxCommand } from '../cli.ts';

export type CommandBuild<T> = (cmd: T) => unknown;
export type TopCommandBuild = CommandBuild<SmxCommand>;

export const TOP = (builder: TopCommandBuild) => builder;
export const SUB = <T>(builder: CommandBuild<T>) => builder;
