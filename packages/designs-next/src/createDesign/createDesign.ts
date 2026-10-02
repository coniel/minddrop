import { Events } from '@minddrop/events';
import { createI18nKeyBuilder, i18n } from '@minddrop/i18n';
import { EntityId, entityId } from '@minddrop/utils';
import { DesignsStore } from '../DesignsStore';
import {
  DesignEntityType,
  DesignTypeColumns,
  DesignTypeRows,
} from '../constants';
import { DesignCreatedEvent } from '../events';
import { Design, DesignType } from '../types';
import { writeDesign } from '../writeDesign';

const typeKey = createI18nKeyBuilder('designsNext.types.');

export interface CreateDesignOptions {
  /**
   * The type of design to create.
   */
  type: DesignType;

  /**
   * The design name. Defaults to the localized name of the design
   * type.
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
 * element grid at the type's dimensions. The design is written to
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
    id: entityId(DesignEntityType),
    name: options.name || i18n.t(typeKey(options.type)),
    type: options.type,
    columns: DesignTypeColumns[options.type],
    rows: DesignTypeRows[options.type],
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
