import { Events } from '@minddrop/events';
import { i18n } from '@minddrop/i18n';
import { entityId } from '@minddrop/utils';
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
}

/**
 * Creates a new persisted design of the given type, seeded with an
 * empty element grid at the default dimensions.
 *
 * @param options - The design type and name.
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

  // Add the design to the store
  DesignsStore.set(design);

  // Write the design to the file system
  await writeDesign(design.id);

  // Dispatch a design created event
  Events.dispatch(DesignCreatedEvent, design);

  return design;
}
