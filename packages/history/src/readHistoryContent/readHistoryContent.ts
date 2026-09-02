import { Fs } from '@minddrop/file-system';
import { resolveContentDirPath } from '../utils';

export interface ReadHistoryContentOptions {
  /**
   * The absolute path of the directory holding the history.
   */
  ownerPath: string;

  /**
   * The subject's key within the owner.
   */
  subjectKey: string;

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
  const { ownerPath, subjectKey, file } = options;
  const contentDirPath = resolveContentDirPath(ownerPath, subjectKey);
  const contentFilePath = Fs.concatPath(contentDirPath, file);

  // Check the file is still there. A record can outlive its contents
  // if they were removed by hand.
  if (!(await Fs.exists(contentFilePath))) {
    return null;
  }

  return Fs.readTextFile(contentFilePath);
}
