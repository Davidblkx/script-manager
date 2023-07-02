import { parse, toFileUrl } from '$deno/path/mod.ts';

export async function followLink(path: URL): Promise<URL> {
  const info = await Deno.stat(path);
  if (!info.isSymlink) {
    throw new Error('Path is not a symlink');
  }

  const fullPath = await Deno.readLink(path);
  return toFileUrl(fullPath);
}

export async function getType(path: URL): Promise<'f' | 'd' | 'l'> {
  const info = await Deno.stat(path);

  if (info.isSymlink) {
    return 'l';
  } else if (info.isFile) {
    return 'f';
  } else if (info.isDirectory) {
    return 'd';
  }

  throw new Deno.errors.NotFound();
}

export async function stat(url: URL): Promise<['f' | 'd', URL]> {
  const type = await getType(url);
  if (type === 'f' || type === 'd') {
    return [type, url];
  }

  const symlink = await followLink(url);
  return await stat(symlink);
}

export function getParentURL(url: URL): URL {
  if (!url.pathname) {
    return url;
  }
  const path = parse(url.href);
  return new URL(path.dir);
}
