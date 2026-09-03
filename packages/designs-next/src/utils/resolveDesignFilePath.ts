import { Fs } from '@minddrop/file-system';
import { DesignFileExtension } from '../constants';
import { resolveDesignsDirPath } from './resolveDesignsDirPath';

/**
 * Returns the path to a design's file inside the designs directory.
 *
 * @param id - The ID of the design.
 * @returns The path to the design file.
 */
export function resolveDesignFilePath(id: string): string {
  return Fs.concatPath(resolveDesignsDirPath(), `${id}.${DesignFileExtension}`);
}
