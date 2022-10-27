export async function getFileInfo(path: string): Promise<Deno.FileInfo | false> {
  try {
    return await Deno.stat(path);
  } catch {
    return false;
  }
}
