import { join } from 'deno/path/mod.ts';

export function getHomeDirectory() {
  return Deno.env.get('HOME') || Deno.env.get('USERPROFILE') || Deno.env.get('HOMEPATH') || '~';
}

export function getConfigDirectory() {
  return join(getHomeDirectory() ?? '~', '.smx');
}

export function getConfigPath() {
  return join(getConfigDirectory(), 'config.json');
}

export function getDefaultRepo() {
  return join(getConfigDirectory(), 'my-script-manager');
}

export async function checkConfigExists() {
  try {
    await Deno.readFile(getConfigPath());
    return true;
  } catch {
    return false;
  }
}
