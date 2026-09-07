import { Events } from '@minddrop/events';
import { i18n } from '@minddrop/i18n';
import { entityId } from '@minddrop/utils';
import { DesignsStore } from '../DesignsStore';
import { DesignCreatedEvent } from '../events';
import { getDesign } from '../getDesign';
import { Design } from '../types';
import { writeDesign } from '../writeDesign';

/**
 * Duplicates a design as a new design of the same type and owner,
 * copying its dimensions, aspect ratio and elements. The copy is
 * written to the file system unless it is owned.
 *
 * @param id - The ID of the design to duplicate.
 * @returns The new design.
 *
 * @throws {DesignNotFoundError} If the design does not exist.
 *
 * @dispatches designs-next:design:created
 */
export async function duplicateDesign(id: string): Promise<Design> {
  // Get the design to duplicate
  const source = getDesign(id);

  const design: Design = {
    ...source,
    id: entityId('design'),
    name: i18n.t('designsNext.copyName', { name: source.name }),
    // Element IDs are unique within a design, fresh ones keep the
    // copy independent of the source.
    elements: source.elements.map((element) => ({
      ...element,
      id: entityId('element'),
    })),
    created: new Date(),
    lastModified: new Date(),
  };

  // Add the design to the store
  DesignsStore.set(design);

  // Dispatch a design created event
  Events.dispatch(DesignCreatedEvent, design);

  // Write unowned designs to the file system
  if (!design.owner) {
    await writeDesign(design.id);
  }

  return design;
}
