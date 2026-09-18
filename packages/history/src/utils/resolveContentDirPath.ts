import { Fs } from '@minddrop/file-system';
import { ContentDirName } from '../constants';
import { HistorySubject } from '../types';
import { resolveSubjectHistoryDirPath } from './resolveSubjectHistoryDirPath';

/**
 * Returns the absolute path of a subject's content directory, which
 * holds the contents its content records point at.
 *
 * @param subject - The subject to resolve the content directory of.
 * @returns The absolute content directory path.
 */
export function resolveContentDirPath(subject: HistorySubject): string {
  return Fs.concatPath(resolveSubjectHistoryDirPath(subject), ContentDirName);
}
