import { Fs } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { HistoryDirName } from '../constants';
import { HistorySubject } from '../types';

/**
 * Returns the absolute path of a subject's history directory, which
 * holds its log files and its content directory.
 *
 * @param subject - The subject to resolve the history directory of.
 * @returns The absolute subject history directory path.
 */
export function resolveSubjectHistoryDirPath(subject: HistorySubject): string {
  return Fs.concatPath(
    subject.ownerPath,
    Paths.hiddenDirName,
    HistoryDirName,
    subject.subjectType,
    subject.subjectKey,
  );
}
