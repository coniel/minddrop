import { DesignUpdatedEventData, VirtualDesignData } from '@minddrop/designs';
import { isEntityId } from '@minddrop/utils';
import { getSpace } from '../../getSpace';
import { updateSpace } from '../../updateSpace';

/**
 * Called when a design is updated. If the design is a virtual
 * design owned by a space, persists the updated design data into
 * the space's file.
 */
export async function onUpdateVirtualDesign(
  data: DesignUpdatedEventData,
): Promise<void> {
  const { updated } = data;

  // Only handle virtual designs owned by a space
  if (
    !updated.virtual ||
    !updated.owner ||
    !isEntityId(updated.owner, 'space')
  ) {
    return;
  }

  // Skip owners that no longer exist (e.g. deleted spaces)
  if (!getSpace(updated.owner, false)) {
    return;
  }

  // Strip the load-time derived fields down to the owner-persisted
  // shape. Destructuring the union erases its discrimination, so
  // restore it
  const { virtual, created, lastModified, ...designData } = updated;
  const design = { ...designData, owner: updated.owner } as VirtualDesignData;

  // Persist the updated design into the space's file
  await updateSpace(updated.owner, { design });
}
