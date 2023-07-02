import { parse, toFileUrl } from '$deno/path/mod.ts';

export async function followLink(path: URL): Promise<URL> {
  const info = await Deno.stat(path);
  if (!info.isSymlink) {
    throw new Error('Path is not a symlink');
  }

  const fullPath = await Deno.readLink(path);
  return toFileUrl(fullPath);
}

export function followLinkSync(path: URL): URL {
  const info = Deno.statSync(path);
  if (!info.isSymlink) {
    throw new Error('Path is not a symlink');
  }

  const fullPath = Deno.readLinkSync(path);
  return toFileUrl(fullPath);
}

export async function getType(path: URL): Promise<'f' | 'd' | 'l'> {
  const info = await Deno.stat(path);
  return getFileType(info);
}

export function getTypeSync(path: URL): 'f' | 'd' | 'l' {
  const info = Deno.statSync(path);
  return getFileType(info);
}

function getFileType(info: Deno.FileInfo): 'f' | 'd' | 'l' {
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

export function statSync(url: URL): ['f' | 'd', URL] {
  const type = getTypeSync(url);
  if (type === 'f' || type === 'd') {
    return [type, url];
  }

  const symlink = followLinkSync(url);
  return statSync(symlink);
}

export function getParentURL(url: URL): URL {
  if (!url.pathname) {
    return url;
  }
  const path = parse(url.href);
  return new URL(path.dir);
}
