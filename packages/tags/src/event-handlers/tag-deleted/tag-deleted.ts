import { TagDeletedEventData } from '../../events';
import { recordWorkspaceTagLedger } from '../../recordWorkspaceTagLedger';

/**
 * Called when a tag is deleted. Records the deletion in the
 * workspace's tags ledger.
 *
 * @param data - The deleted tag's data.
 */
export async function onTagDeleted(data: TagDeletedEventData): Promise<void> {
  // Record the deletion in the workspace's tags ledger
  await recordWorkspaceTagLedger({
    kind: 'deleted',
    subject: { key: data.name, id: data.id },
    action: data.action,
  });
}
