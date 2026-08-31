import { Fs } from '@minddrop/file-system';
import { TagFileExtension } from '../constants';
import { resolveTagGroupsDirPath } from './resolveTagGroupsDirPath';

/**
 * Returns the path to a tag group file.
 *
 * @param id - The ID of the tag group.
 * @returns The path to the tag group file.
 */
export function resolveTagGroupFilePath(id: string) {
  return Fs.concatPath(
    resolveTagGroupsDirPath(),
    Fs.addFileExtension(id, TagFileExtension),
  );
}
