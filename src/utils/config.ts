import { join } from 'deno/path/mod.ts';

export function getHomeDirectory() {
  if (Deno.build.os === 'windows') {
    return Deno.env.get('USERPROFILE');
  } else {
    return Deno.env.get('HOME');
  }
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
