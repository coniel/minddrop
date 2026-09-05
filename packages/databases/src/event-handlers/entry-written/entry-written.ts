import { Fs, hashContents } from '@minddrop/file-system';
import { History } from '@minddrop/history';
import {
  ContentCapture,
  contentCaptureKey,
  getContentCapture,
  recordContentCapture,
} from '../../contentCaptureRegistry';
import { DatabaseEntryWrittenEventData } from '../../events';
import { resolveContentCaptureGap } from '../../utils';

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

  const key = contentCaptureKey(database.path, entry.title);
  const contentHash = hashContents(previousContents);

  // Fall back to the entry's history for a capture made in an earlier
  // session.
  const lastCapture =
    getContentCapture(key) ?? (await readLastCapture(database.path, entry));

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
  await History.record({
    ownerPath: database.path,
    subjectKey: entry.title,
    kind: 'content',
    contents: previousContents,
    extension: Fs.getFileExtension(entry.path),
  });

  recordContentCapture(key, { capturedAt, contentHash });
}

/**
 * Reads an entry's most recent content capture from its history, for
 * entries last captured in an earlier session.
 */
async function readLastCapture(
  databasePath: string,
  entry: { title: string },
): Promise<ContentCapture | null> {
  // Read the entry's history
  const records = await History.read({
    ownerPath: databasePath,
    subjectKey: entry.title,
  });

  // Find the most recent content record. The history is read oldest
  // first, so the last one is the most recent.
  const captures = records.filter((record) => record.kind === 'content');
  const last = captures[captures.length - 1];

  // Check the entry has had its content captured before
  if (!last) {
    return null;
  }

  return { capturedAt: last.timestamp, contentHash: last.contentHash };
}
