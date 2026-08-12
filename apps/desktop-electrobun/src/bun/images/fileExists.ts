import fsp from 'node:fs/promises';

/**
 * Checks whether a file exists at the given path.
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fsp.access(filePath);

    return true;
  } catch {
    return false;
  }
}
