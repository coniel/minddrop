import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { i18n } from '@minddrop/i18n';
import { MetadataPropertySchemas, PropertySchema } from '@minddrop/properties';
import { entityId } from '@minddrop/utils';
import { DesignsStore } from '../DesignsStore';
import { DesignCreatedEvent } from '../events';
import { Design } from '../types';
import { resolveDesignsDirPath } from '../utils';
import { writeDesign } from '../writeDesign';

/**
 * Creates a new design containing the entry metadata properties.
 *
 * @param name - The design name, defaults to a generic localized label.
 * @returns The new design.
 *
 * @dispatches 'designs:design:created'
 */
export async function createDesign(name?: string): Promise<Design> {
  // Ensure the designs directory exists
  await Fs.ensureDir(resolveDesignsDirPath());

  // Every entry has metadata, so new designs can bind to it
  // without the user declaring the properties themselves
  const properties = MetadataPropertySchemas.map(
    (schema): PropertySchema => ({ ...schema, name: i18n.t(schema.name) }),
  );

  const design: Design = {
    id: entityId('design'),
    name: name || i18n.t('designs.new'),
    properties,
    layouts: [],
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
