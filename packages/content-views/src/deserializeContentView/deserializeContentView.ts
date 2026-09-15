import { restoreDates } from '@minddrop/utils';
import { resolveContentViewConfig } from '../resolveContentViewConfig';
import { StoredContentView } from '../types';

/**
 * Deserializes a stored content view: restores its date fields and
 * resolves the config's durable references into item IDs.
 *
 * @param storedView - The stored content view to deserialize.
 * @param workspaceId - The workspace to resolve the references in. Omit for the active workspace.
 * @returns The deserialized content view.
 */
export function deserializeContentView(
  storedView: StoredContentView,
  workspaceId?: string,
): StoredContentView {
  // Restore the view's date fields (dates are stored as ISO strings)
  const view = restoreDates<StoredContentView>(storedView);

  // Resolve the stored config's durable references into item IDs
  return {
    ...view,
    ...resolveContentViewConfig(
      view.type,
      { options: view.options, data: view.data },
      workspaceId,
    ),
  };
}
