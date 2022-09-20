import { SmxCommand } from "../../cli.ts";
import { TopCommandBuild } from '../utils.ts';

import { FOLDER } from './folder.ts';
import { WHERE } from './where.ts';

export const CoreCommands: TopCommandBuild[] = [
  FOLDER,
  WHERE,
];

export function registerCoreCommands(cmd: SmxCommand) {
  CoreCommands.forEach((builder) => builder(cmd));
}
