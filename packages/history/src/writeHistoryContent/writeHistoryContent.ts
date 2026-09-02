import { Fs } from '@minddrop/file-system';
import { ContentRecordOptions } from '../types';
import { resolveContentDirPath, resolveTimestampName } from '../utils';

/**
 * Stores a content change's contents beside the subject's log, named
 * after the time the change was recorded at.
 *
 * @param options - The content change being recorded.
 * @param timestamp - The time the change is being recorded at.
 * @returns The name of the file the contents were stored under.
 */
export async function writeHistoryContent(
  options: ContentRecordOptions,
  timestamp: Date,
): Promise<string> {
  const contentDirPath = resolveContentDirPath(
    options.ownerPath,
    options.subjectKey,
  );

  // Name the file after the time the change was recorded at, in the
  // subject's own format.
  const name = `${resolveTimestampName(timestamp)}.${options.extension}`;

  // Ensure the content directory exists, in case this is the
  // subject's first recorded content change.
  await Fs.ensureDir(contentDirPath);

  // Increment the name if it is taken. Two changes recorded within
  // the same millisecond would otherwise share a file, and the first
  // record would end up pointing at the second's contents.
  const { path } = await Fs.incrementalPath(
    Fs.concatPath(contentDirPath, name),
  );

  // Write the contents
  await Fs.writeTextFile(path, options.contents);

  return Fs.fileNameFromPath(path);
}
