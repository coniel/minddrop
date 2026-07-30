import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { i18n } from '@minddrop/i18n';
import { uuid } from '@minddrop/utils';
import { DesignsStore } from '../DesignsStore';
import { DesignCreatedEvent, DesignCreatedEventData } from '../events';
import { Design } from '../types';
import { getDesignsDirPath } from '../utils';
import { writeDesign } from '../writeDesign';

/**
 * Creates a new, empty design.
 *
 * @param name - The design name, defaults to a generic localized label.
 * @returns The new design.
 *
 * @dispatches 'designs:design:created'
 */
export async function createDesign(name?: string): Promise<Design> {
  // Ensure the designs directory exists
  await Fs.ensureDir(getDesignsDirPath());

  const design: Design = {
    id: uuid(),
    name: name || i18n.t('designs.new'),
    properties: [],
    layouts: [],
    created: new Date(),
    lastModified: new Date(),
  };

  // Add the design to the store
  DesignsStore.set(design);

  // Write the design to the file system
  await writeDesign(design.id);

  // Dispatch a design created event
  Events.dispatch<DesignCreatedEventData>(DesignCreatedEvent, design);

  return design;
}
