import { EntryMetadataUpdatedEventData } from '../../events';
import { sqlUpdateEntryMetadata } from '../../sql';

/**
 * Called when entry metadata is updated. Syncs the updated
 * metadata to the SQL database.
 */
export function onUpdateEntryMetadata(
  data: EntryMetadataUpdatedEventData,
): void {
  sqlUpdateEntryMetadata(data.entryId, data.metadata);
}
