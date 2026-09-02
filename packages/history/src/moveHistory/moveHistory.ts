import { Fs } from '@minddrop/file-system';
import { resolveSubjectHistoryDirPath } from '../utils';

export interface MoveHistoryOptions {
  /**
   * The absolute path of the directory holding the history.
   */
  ownerPath: string;

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
  const { ownerPath, fromKey, toKey } = options;
  const fromDirPath = resolveSubjectHistoryDirPath(ownerPath, fromKey);
  const toDirPath = resolveSubjectHistoryDirPath(ownerPath, toKey);

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
  await Promise.all(contents.map((entry) => moveEntry(entry.path, toDirPath)));

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
 * Moves a single file or directory into the destination history
 * directory. A directory the destination also has is merged into
 * rather than skipped, so that what it holds is not stranded under
 * the old key.
 */
async function moveEntry(path: string, toDirPath: string): Promise<void> {
  const target = Fs.concatPath(toDirPath, Fs.fileNameFromPath(path));

  // Check if the name is free, in which case the whole file or
  // directory can be renamed across
  if (!(await Fs.exists(target))) {
    await Fs.rename(path, target);

    return;
  }

  // Check whether the taken name is a file. History files are only
  // ever written once, so the one already there is left alone.
  if (!(await Fs.isDirectory(path))) {
    return;
  }

  // Read the directory whose name is taken
  const contents = await Fs.readDir(path);

  // Move what it holds into the directory already there
  await Promise.all(contents.map((entry) => moveEntry(entry.path, target)));

  // Read it again
  const remaining = await Fs.readDir(path);

  // Check if anything was left behind by a file name conflict. If so,
  // keep the directory rather than losing what is still in it.
  if (remaining.length) {
    return;
  }

  // Remove the now empty directory
  await Fs.removeDir(path);
}
