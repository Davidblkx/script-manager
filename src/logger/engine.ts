import { LoggerEngine } from './models.ts';
import { applyColor } from './_color.ts';

export const InternalLoggerEngine: LoggerEngine = {
  default: (m, ...p) => console.log(...applyColor('white', [m, ...p])),
  engine: (m, ...p) => console.log(...applyColor('pink', [m, ...p])),
  info: (m, ...p) => console.info(...applyColor('blue', [m, ...p])),
  debug: (m, ...p) => console.debug(...applyColor('grey', [m, ...p])),
  warning: (m, ...p) => console.warn(...applyColor('yellow', [m, ...p])),
  error: (m, ...p) => console.error(...applyColor('red', [m, ...p])),
};
