import { TagRenamedEventData } from '@minddrop/tags';
import { recordRename } from '../../recordRename';

/**
 * Called when a tag is renamed. Records the rename in the rename
 * ledger under the tag's name.
 */
export async function onTagRenamed(data: TagRenamedEventData): Promise<void> {
  const { original, updated } = data;

  // Record the rename in the rename ledger
  await recordRename({
    from: original.name,
    to: updated.name,
    kind: 'tag',
    entityId: updated.id,
  });
}
