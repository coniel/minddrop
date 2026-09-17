import { Fs } from '@minddrop/file-system';
import { HistorySubject } from '../types';
import { resolveContentDirPath } from '../utils';

export interface ReadHistoryContentOptions extends HistorySubject {
  /**
   * The file name carried by the content record.
   */
  file: string;
}

/**
 * Reads the contents stored for a content record.
 *
 * @param options - The content to read.
 * @returns The stored contents, or null if the file is missing.
 */
export async function readHistoryContent(
  options: ReadHistoryContentOptions,
): Promise<string | null> {
  const contentDirPath = resolveContentDirPath(options);
  const contentFilePath = Fs.concatPath(contentDirPath, options.file);

  // Check the file is still there. A record can outlive its contents
  // if they were removed by hand.
  if (!(await Fs.exists(contentFilePath))) {
    return null;
  }

  return Fs.readTextFile(contentFilePath);
}
