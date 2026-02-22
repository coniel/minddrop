import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { i18n } from '@minddrop/i18n';
import { Paths, uuid } from '@minddrop/utils';
import { DesignsStore } from '../DesignsStore';
import { DesignFileExtension } from '../constants';
import { DesignCreatedEvent, DesignCreatedEventData } from '../events';
import { Design, DesignType } from '../types';
import { writeDesign } from '../writeDesign';

/**
 * Creates a new, empty design.
 *
 * @param type - The design type.
 * @param name - The design name, defaults to the design type name, incremented if a design with the same name already exists.
 * @returns The generated design.
 *
 * @dispatches 'designs:design:created'
 */
export async function createDesign(
  type: DesignType,
  name?: string,
): Promise<Design> {
  // Use the design type name as the default name
  const targetName = name || i18n.t(`designs.${type}.name`);
  // Generate the path to the design file
  const targetPath = `${Paths.designs}/${targetName}.${DesignFileExtension}`;

  // Ensure the designs root directory exists
  await Fs.ensureDir(Paths.designs);

  // Get an incremented name and path to the design file
  const { title, path } = await Fs.incrementalPath(targetPath);

  // Generate a new design
  const design: Design = {
    type,
    id: uuid(),
    path,
    name: title,
    created: new Date(),
    lastModified: new Date(),
    tree: {
      id: 'root',
      type: 'root',
      children: [],
    },
  };

  // Add the design to the store
  DesignsStore.add(design);

  // Write the design to the file system
  await writeDesign(design.id);

  // Dispatch a design created event
  Events.dispatch<DesignCreatedEventData>(DesignCreatedEvent, design);

  return design;
}
