import { Fs } from '@minddrop/file-system';
import { moveCaptureRecord } from '../captureRegistry';
import { resolveSubjectHistoryDirPath } from '../utils';

export interface MoveSnapshotHistoryOptions {
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
 * renamed subject keeps the snapshots taken under its old name.
 *
 * @param options - The move options.
 */
export async function moveSnapshotHistory(
  options: MoveSnapshotHistoryOptions,
): Promise<void> {
  const { ownerPath, fromKey, toKey } = options;
  const fromPath = resolveSubjectHistoryDirPath(ownerPath, fromKey);
  const toPath = resolveSubjectHistoryDirPath(ownerPath, toKey);

  // Subjects which have never been captured have nothing to move
  if (!(await Fs.exists(fromPath))) {
    return;
  }

  moveCaptureRecord(fromPath, toPath);

  // A key with no history of its own takes the whole directory
  if (!(await Fs.exists(toPath))) {
    await Fs.rename(fromPath, toPath);

    return;
  }

  // Otherwise the two histories merge, as when a subject is renamed
  // to a key an earlier subject was captured under
  const snapshots = await Fs.readDir(fromPath);

  await Promise.all(
    snapshots.map((snapshot) => moveSnapshot(snapshot.path, toPath)),
  );

  const remaining = await Fs.readDir(fromPath);

  // Anything which could not move stays where it is rather than
  // being lost with its directory
  if (remaining.length) {
    return;
  }

  await Fs.removeDir(fromPath);
}

/**
 * Moves a single snapshot directory into a destination history
 * directory, leaving it where it is if the destination already holds
 * a snapshot of the same name.
 */
async function moveSnapshot(path: string, toPath: string): Promise<void> {
  const target = Fs.concatPath(toPath, Fs.fileNameFromPath(path));

  // Snapshots are immutable, so an occupied name keeps its snapshot
  if (await Fs.exists(target)) {
    return;
  }

  await Fs.rename(path, target);
}
