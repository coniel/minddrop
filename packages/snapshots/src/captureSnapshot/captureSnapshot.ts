import { Fs, hashContents } from '@minddrop/file-system';
import {
  CaptureRecord,
  getLastCapture,
  recordCapture,
} from '../captureRegistry';
import { SnapshotManifestFileName } from '../constants';
import { Snapshot, SnapshotCause, SnapshotManifest } from '../types';
import {
  parseSnapshotDirName,
  readSnapshotManifest,
  resolveIdleGap,
  resolveSnapshotDirPath,
  resolveSubjectHistoryDirPath,
} from '../utils';

export interface CaptureSnapshotOptions {
  /**
   * The absolute path of the directory whose history the snapshot
   * belongs to.
   */
  ownerPath: string;

  /**
   * The subject's key within the owner, under which its snapshots
   * are grouped.
   */
  subjectKey: string;

  /**
   * The name the captured file is stored under, which is the
   * subject's own file name.
   */
  fileName: string;

  /**
   * The contents to capture.
   */
  contents: string;

  /**
   * What the capture is being made for.
   */
  cause: SnapshotCause;

  /**
   * The automation run the capture belongs to, when made during one.
   */
  runId?: string;
}

/**
 * Captures contents a subject held as a snapshot. What history
 * offers is the state a subject was in before an editing session, so
 * captures are spaced by an idle gap and skipped when they would
 * record nothing new.
 *
 * @param options - The capture options.
 * @returns The captured snapshot, or null if no capture was made.
 */
export async function captureSnapshot(
  options: CaptureSnapshotOptions,
): Promise<Snapshot | null> {
  const { ownerPath, subjectKey, fileName, contents, cause, runId } = options;
  const subjectHistoryDirPath = resolveSubjectHistoryDirPath(
    ownerPath,
    subjectKey,
  );
  const contentHash = hashContents(contents);

  // Fall back to the newest snapshot on disk for subjects not yet
  // captured in this session
  const lastCapture =
    getLastCapture(subjectHistoryDirPath) ??
    (await readLastCapture(subjectHistoryDirPath));

  // Contents already held by the newest snapshot have nothing to add
  // to the subject's history, which is what makes capturing
  // idempotent
  if (lastCapture?.contentHash === contentHash) {
    return null;
  }

  const capturedAt = new Date();
  const elapsed = lastCapture
    ? capturedAt.getTime() - lastCapture.capturedAt.getTime()
    : Infinity;

  // Larger subjects capture less often, since copying one costs the
  // most
  if (elapsed < resolveIdleGap(contents.length)) {
    return null;
  }

  const path = resolveSnapshotDirPath(ownerPath, subjectKey, capturedAt);

  // Snapshots are written once and never modified, so a capture
  // landing in an occupied second yields to the one already there
  if (await Fs.exists(path)) {
    return null;
  }

  const manifest: SnapshotManifest = { capturedAt, cause, contentHash };

  // Automation runs tag their captures so that reverting a run can
  // find the set it made
  if (runId) {
    manifest.runId = runId;
  }

  await Fs.createDir(path, { recursive: true });

  // The captured file keeps the subject's own name, so a snapshot
  // can be opened without the app
  await Fs.writeTextFile(Fs.concatPath(path, fileName), contents);
  await Fs.writeJsonFile(
    Fs.concatPath(path, SnapshotManifestFileName),
    manifest,
  );

  recordCapture(subjectHistoryDirPath, { capturedAt, contentHash });

  return { ...manifest, path };
}

/**
 * Reads a subject's most recent capture from its history directory,
 * used to seed the capture registry for subjects last captured in an
 * earlier session.
 */
async function readLastCapture(
  subjectHistoryDirPath: string,
): Promise<CaptureRecord | null> {
  // A subject which has never been captured has no history directory
  if (!(await Fs.exists(subjectHistoryDirPath))) {
    return null;
  }

  const entries = await Fs.readDir(subjectHistoryDirPath);

  // Snapshot directory names are fixed-width UTC timestamps, so
  // sorting them alphabetically sorts them chronologically
  const dirNames = entries
    .map((entry) => entry.name || '')
    .filter((name) => parseSnapshotDirName(name) !== null)
    .sort();

  // The history directory holds nothing the app wrote
  if (!dirNames.length) {
    return null;
  }

  const manifest = await readSnapshotManifest(
    Fs.concatPath(subjectHistoryDirPath, dirNames[dirNames.length - 1]),
  );

  if (!manifest) {
    return null;
  }

  return {
    capturedAt: manifest.capturedAt,
    contentHash: manifest.contentHash,
  };
}
