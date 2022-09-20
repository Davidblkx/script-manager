// deno-lint-ignore-file no-explicit-any
import { LoggerEngine } from "./models.ts";
import { applyColor } from "./_color.ts";

type LogKey = Pick<Console, 'log' | 'debug' | 'error' | 'warn' | 'info'>;

const logs: ([keyof LogKey, any[]])[] = [];

function log(key: keyof LogKey, ...args: any[]) {
  logs.push([key, args]);
  console[key](...args);
}

export const ProgressLogger: LoggerEngine = {
  default: (m, ...p) => log('log', ...applyColor('white', [m, ...p])),
  engine: (m, ...p) => log('log', ...applyColor('pink', [m, ...p])),
  info: (m, ...p) => log('info', ...applyColor('blue', [m, ...p])),
  debug: (m, ...p) => log('debug', ...applyColor('grey', [m, ...p])),
  warning: (m, ...p) => log('warn', ...applyColor('yellow', [m, ...p])),
  error: (m, ...p) => log('error', ...applyColor('red', [m, ...p])),
}
