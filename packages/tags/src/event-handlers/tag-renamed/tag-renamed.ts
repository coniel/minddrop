import { TagRenamedEventData } from '../../events';
import { recordWorkspaceTagLedger } from '../../recordWorkspaceTagLedger';

/**
 * Called when a tag is renamed. Records the rename in the workspace's
 * tags ledger.
 *
 * @param data - The renamed tag's data.
 */
export async function onTagRenamed(data: TagRenamedEventData): Promise<void> {
  const { original, updated, action } = data;

  // Record the rename under the old name
  await recordWorkspaceTagLedger({
    kind: 'rename',
    subject: { key: original.name, id: original.id },
    to: updated.name,
    action,
  });
}
