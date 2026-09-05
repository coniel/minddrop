import { Events } from '@minddrop/events';
import { i18n } from '@minddrop/i18n';
import { EntityId, entityId } from '@minddrop/utils';
import { DesignsStore } from '../DesignsStore';
import { DefaultDesignColumns, DefaultDesignRows } from '../constants';
import { DesignCreatedEvent } from '../events';
import { Design, DesignType } from '../types';
import { writeDesign } from '../writeDesign';

export interface CreateDesignOptions {
  /**
   * The type of design to create.
   */
  type: DesignType;

  /**
   * The design name. Defaults to a generic localized label.
   */
  name?: string;

  /**
   * The ID of the entity which owns the design. When omitted, the
   * design is written to its own design file.
   */
  owner?: EntityId;
}

/**
 * Creates a new design of the given type, seeded with an empty
 * element grid at the default dimensions. The design is written to
 * the file system unless it is owned.
 *
 * @param options - The design type, name and owner.
 * @returns The new design.
 *
 * @dispatches designs-next:design:created
 */
export async function createDesign(
  options: CreateDesignOptions,
): Promise<Design> {
  const design: Design = {
    id: entityId('design'),
    name: options.name || i18n.t('designsNext.new'),
    type: options.type,
    columns: DefaultDesignColumns,
    rows: DefaultDesignRows,
    elements: [],
    created: new Date(),
    lastModified: new Date(),
  };

  // Record the owner when given
  if (options.owner) {
    design.owner = options.owner;
  }

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
