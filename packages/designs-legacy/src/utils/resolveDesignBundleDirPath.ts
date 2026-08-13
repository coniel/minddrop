import { Fs } from '@minddrop/file-system';
import { resolveDesignsDirPath } from './resolveDesignsDirPath';

/**
 * Returns the path to a design's bundle directory, which contains
 * the design file along with the design's media files.
 *
 * @param id - The ID of the design.
 * @returns The path to the design bundle directory.
 */
export function resolveDesignBundleDirPath(id: string): string {
  return Fs.concatPath(resolveDesignsDirPath(), id);
}
