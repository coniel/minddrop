import { Fs } from '@minddrop/file-system';
import { DesignFileName } from '../constants';
import { resolveDesignBundleDirPath } from './resolveDesignBundleDirPath';

/**
 * Returns the path to a design file inside its bundle directory.
 *
 * @param id - The ID of the design.
 * @returns The path to the design file.
 */
export function resolveDesignFilePath(id: string): string {
  return Fs.concatPath(resolveDesignBundleDirPath(id), DesignFileName);
}
