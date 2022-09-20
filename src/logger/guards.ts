import { isObject } from '../utils/guards.ts';
import { LogOptionExtra } from './models.ts';

export function isLogOptionExtra(e: unknown): e is LogOptionExtra {
  if (!isObject(e)) return false;
  const o = e as LogOptionExtra;
  return typeof o.$assert === 'boolean'
   || typeof o.$timer === 'string'
   || typeof o.$preserve === 'boolean';
}
