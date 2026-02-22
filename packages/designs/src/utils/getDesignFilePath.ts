import { Fs } from '@minddrop/file-system';
import { DesignFileExtension } from '../constants';
import { getDesignsDirPath } from './getDesignsDirPath';

/**
 * Returns the path to a design file.
 *
 * @param id - The ID of the design.
 * @returns The path to the design file.
 */
export function getDesignFilePath(id: string): string {
  return Fs.concatPath(
    getDesignsDirPath(),
    Fs.addFileExtension(id, DesignFileExtension),
  );
}
