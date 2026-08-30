import { Fs } from '@minddrop/file-system';
import { TagFileExtension } from '../constants';
import { resolveTagsDirPath } from './resolveTagsDirPath';

/**
 * Returns the path to a tag file.
 *
 * @param id - The ID of the tag.
 * @returns The path to the tag file.
 */
export function resolveTagFilePath(id: string) {
  return Fs.concatPath(
    resolveTagsDirPath(),
    Fs.addFileExtension(id, TagFileExtension),
  );
}
