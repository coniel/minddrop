import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { i18n } from '@minddrop/i18n';
import { MetadataPropertySchemas, PropertySchema } from '@minddrop/properties';
import { entityId } from '@minddrop/utils';
import { DesignsStore } from '../DesignsStore';
import { DesignCreatedEvent } from '../events';
import { Design, DesignType } from '../types';
import { resolveDesignsDirPath } from '../utils';
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
 * Creates a new persisted design of the given type. Database designs
 * are seeded with the entry metadata properties.
 *
 * @param options - The design type and name.
 * @returns The new design.
 *
 * @dispatches 'designs:design:created'
 */
export async function createDesign(
  options: CreateDesignOptions,
): Promise<Design> {
  // Ensure the designs directory exists
  await Fs.ensureDir(resolveDesignsDirPath());

  const base = {
    id: entityId('design'),
    name: options.name || i18n.t('designs.new'),
    layouts: [],
    created: new Date(),
    lastModified: new Date(),
  };

  // Only database designs carry a property schema, seeded with the
  // entry metadata properties so new designs can bind to them without
  // the user declaring the properties themselves
  const design: Design =
    options.type === 'database'
      ? {
          ...base,
          type: 'database',
          properties: MetadataPropertySchemas.map(
            (schema): PropertySchema => ({
              ...schema,
              name: i18n.t(schema.name),
            }),
          ),
        }
      : { ...base, type: options.type };

  // Add the design to the store
  DesignsStore.set(design);

  // Write the design to the file system
  await writeDesign(design.id);

  // Dispatch a design created event
  Events.dispatch(DesignCreatedEvent, design);

  return design;
}
