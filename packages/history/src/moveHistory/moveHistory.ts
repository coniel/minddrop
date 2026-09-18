import { Fs } from '@minddrop/file-system';
import { LogFileExtension } from '../constants';
import { resolveArchiveLogPath, resolveSubjectHistoryDirPath } from '../utils';

export interface MoveHistoryOptions {
  /**
   * The absolute path of the directory holding the history.
   */
  ownerPath: string;

  /**
   * The type of thing the subject is.
   */
  subjectType: string;

  /**
   * The subject's key before the move.
   */
  fromKey: string;

  /**
   * The subject's key after the move.
   */
  toKey: string;
}

/**
 * Moves a subject's history to follow it to a new key, so that a
 * renamed subject keeps the history recorded under its old name.
 *
 * @param options - The move options.
 */
export async function moveHistory(options: MoveHistoryOptions): Promise<void> {
  const { ownerPath, subjectType, fromKey, toKey } = options;
  const fromDirPath = resolveSubjectHistoryDirPath({
    ownerPath,
    subjectType,
    subjectKey: fromKey,
  });
  const toDirPath = resolveSubjectHistoryDirPath({
    ownerPath,
    subjectType,
    subjectKey: toKey,
  });

  // Check the subject has a history directory. It only gets one once
  // something has been recorded against it.
  if (!(await Fs.exists(fromDirPath))) {
    return;
  }

  // Check if the new key already has a history. If not, the
  // directory can simply be renamed.
  if (!(await Fs.exists(toDirPath))) {
    await Fs.rename(fromDirPath, toDirPath);

    return;
  }

  // Read the old key's history files
  const contents = await Fs.readDir(fromDirPath);

  // Move each log and the content directory across
  await Promise.all(
    contents.map((entry) => moveHistoryFile(entry.path, toDirPath)),
  );

  // Read the old directory again
  const remaining = await Fs.readDir(fromDirPath);

  // Check if anything was left behind by a file name conflict. If so,
  // keep the directory rather than losing what is still in it.
  if (remaining.length) {
    return;
  }

  // Remove the now empty directory
  await Fs.removeDir(fromDirPath);
}

/**
 * Moves a log file or the content directory into the destination
 * history directory.
 */
async function moveHistoryFile(path: string, toDirPath: string): Promise<void> {
  const target = Fs.concatPath(toDirPath, Fs.fileNameFromPath(path));

  // Check if the name is free, in which case the whole file or
  // directory can be renamed across.
  if (!(await Fs.exists(target))) {
    await Fs.rename(path, target);

    return;
  }

  // Merge into a content directory the destination also has, so that
  // what it holds is not stranded under the old key.
  if (await Fs.isDirectory(path)) {
    await mergeContentDir(path, target);

    return;
  }

  // A log whose name is taken goes in under an archive name. The
  // reader merges every log in a history directory and sorts by
  // timestamp, so the arriving records read as part of the history
  // they join rather than being stranded under the old key.
  if (Fs.getFileExtension(path) === LogFileExtension) {
    const { path: archivePath } = await Fs.incrementalPath(
      resolveArchiveLogPath(toDirPath),
    );

    await Fs.rename(path, archivePath);
  }
}

/**
 * Merges a content directory into the one the destination holds.
 */
async function mergeContentDir(
  fromDirPath: string,
  toDirPath: string,
): Promise<void> {
  const contents = await Fs.readDir(fromDirPath);

  // Move across each file whose name is free. Content files are
  // written once, so a file whose name is taken holds the same
  // contents and is left where it is.
  await Promise.all(
    contents.map(async (entry) => {
      const target = Fs.concatPath(toDirPath, Fs.fileNameFromPath(entry.path));

      if (await Fs.exists(target)) {
        return;
      }

      await Fs.rename(entry.path, target);
    }),
  );

  // Read the directory again
  const remaining = await Fs.readDir(fromDirPath);

  // Check if anything was left behind by a file name conflict. If so,
  // keep the directory rather than losing what is still in it.
  if (remaining.length) {
    return;
  }

  // Remove the now empty directory
  await Fs.removeDir(fromDirPath);
}
