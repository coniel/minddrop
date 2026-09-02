import { Fs } from '@minddrop/file-system';
import { ContentDirName } from '../constants';
import { resolveSubjectHistoryDirPath } from './resolveSubjectHistoryDirPath';

/**
 * Returns the absolute path of a subject's content directory, which
 * holds the contents its content records point at.
 *
 * @param ownerPath - The absolute path of the owner directory.
 * @param subjectKey - The subject's key within the owner.
 * @returns The absolute content directory path.
 */
export function resolveContentDirPath(
  ownerPath: string,
  subjectKey: string,
): string {
  return Fs.concatPath(
    resolveSubjectHistoryDirPath(ownerPath, subjectKey),
    ContentDirName,
  );
}
