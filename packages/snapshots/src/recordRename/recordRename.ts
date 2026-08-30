import { Fs } from '@minddrop/file-system';
import { RenameEvent, RenameEventKind } from '../types';
import { resolveRenameEventFilePath, resolveRenamesDirPath } from '../utils';

// The timestamp of the last recorded event, used to keep event
// timestamps strictly increasing
let lastEventTimestampMs = 0;

export interface RecordRenameOptions {
  /**
   * The renamed entity's address before the rename.
   */
  from: string;

  /**
   * The renamed entity's address after the rename.
   */
  to: string;

  /**
   * The kind of entity that was renamed.
   */
  kind: RenameEventKind;

  /**
   * The renamed entity's fixed ID, for kinds whose entities
   * carry one.
   */
  entityId?: string;
}

/**
 * Records a rename event in the workspace's rename ledger.
 *
 * Events record entity addresses rather than file paths: the
 * database name for databases, `<database name>/<entry title>` for
 * entries and `<database name>/<property name>` for properties.
 * Addresses are independent of the on-disk layout, so storage mode
 * and file format changes do not affect them.
 *
 * @param options - The rename details.
 * @returns The recorded rename event.
 */
export async function recordRename(
  options: RecordRenameOptions,
): Promise<RenameEvent> {
  // Keep timestamps strictly increasing so that events recorded
  // within the same millisecond replay in the order they were
  // recorded
  const timestampMs = Math.max(Date.now(), lastEventTimestampMs + 1);
  lastEventTimestampMs = timestampMs;

  // Build the rename event
  const event: RenameEvent = {
    timestamp: new Date(timestampMs),
    from: options.from,
    to: options.to,
    kind: options.kind,
  };

  // Record the entity ID when the entity kind carries one
  if (options.entityId) {
    event.entityId = options.entityId;
  }

  // Ensure the ledger directory exists
  await Fs.ensureDir(resolveRenamesDirPath());

  // Write the event as its own immutable file
  await Fs.writeJsonFile(resolveRenameEventFilePath(event), event);

  return event;
}
