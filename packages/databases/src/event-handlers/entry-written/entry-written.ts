import { Fs } from '@minddrop/file-system';
import {
  contentCaptureKey,
  getContentCapture,
  recordContentCapture,
} from '../../contentCaptureRegistry';
import { DatabaseEntryWrittenEventData } from '../../events';
import { readDatabaseEntryLastContentCapture } from '../../readDatabaseEntryLastContentCapture';
import { recordDatabaseEntryHistory } from '../../recordDatabaseEntryHistory';
import {
  resolveContentCaptureGap,
  resolveDatabaseEntryPath,
  resolveDatabasePath,
} from '../../utils';

/**
 * Called when an entry's file is written. Captures the content the
 * write replaced.
 */
export async function onEntryWritten(
  data: DatabaseEntryWrittenEventData,
): Promise<void> {
  const { entry, database, previousContents } = data;

  // Check whether the write replaced anything. An entry written for
  // the first time did not.
  if (previousContents === undefined) {
    return;
  }

  const databasePath = resolveDatabasePath(database);
  const key = contentCaptureKey(databasePath, entry.title);
  const contentHash = Fs.hashContents(previousContents);

  // Fall back to the entry's history for a capture made in an earlier
  // session.
  const lastCapture =
    getContentCapture(key) ??
    (await readDatabaseEntryLastContentCapture(database, entry));

  // Check whether the content has already been captured, which makes
  // capturing idempotent.
  if (lastCapture?.contentHash === contentHash) {
    return;
  }

  const capturedAt = new Date();
  const elapsed = lastCapture
    ? capturedAt.getTime() - lastCapture.capturedAt.getTime()
    : Infinity;

  // Check whether enough time has passed since the last capture
  if (elapsed < resolveContentCaptureGap(previousContents.length)) {
    return;
  }

  // Record the content the write replaced
  await recordDatabaseEntryHistory(database, entry, {
    kind: 'content',
    contents: previousContents,
    extension: Fs.getFileExtension(resolveDatabaseEntryPath(entry, database)),
  });

  recordContentCapture(key, { capturedAt, contentHash });
}
