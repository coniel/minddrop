import { Events } from '@minddrop/events';
import { i18n } from '@minddrop/i18n';
import { DesignsStore } from '../DesignsStore';
import { DesignCreatedEvent, DesignCreatedEventData } from '../events';
import { CreateVirtualDesignData, Design } from '../types';

/**
 * Creates a virtual design: one that exists only in memory and is
 * persisted by its owner rather than to a design bundle. Synchronous
 * and file system free.
 *
 * @param data - The virtual design data.
 * @returns The new virtual design.
 *
 * @dispatches 'designs:design:created'
 */
export function createVirtualDesign(data: CreateVirtualDesignData): Design {
  const base = {
    id: data.id,
    name: data.name || i18n.t('designs.new'),
    layouts: data.layouts ?? [],
    virtual: true,
    owner: data.owner,
    ownerKey: data.ownerKey,
    created: new Date(),
    lastModified: new Date(),
  };

  // Only database designs carry a property schema
  const design: Design =
    data.type === 'database'
      ? { ...base, type: 'database', properties: [] }
      : { ...base, type: data.type };

  // Add the design to the store
  DesignsStore.set(design);

  // Dispatch a design created event
  Events.dispatch<DesignCreatedEventData>(DesignCreatedEvent, design);

  return design;
}
