import { parse, join } from "deno/path/mod.ts";

export async function getFileInfo(path: string): Promise<Deno.FileInfo | false> {
  try {
    return await Deno.stat(path);
  } catch {
    return false;
  }
}

export function getFolder(path: string): string {
  const info = parse(path);
  return info.dir;
}

export function getBrotherFile(path: string, name: string): string {
  const info = parse(path);
  return join(info.dir, name);
}
