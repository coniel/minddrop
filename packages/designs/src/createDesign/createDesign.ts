import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { i18n } from '@minddrop/i18n';
import { uuid } from '@minddrop/utils';
import { DesignsStore } from '../DesignsStore';
import { DesignCreatedEvent, DesignCreatedEventData } from '../events';
import { DefaultContainerElementStyle } from '../styles';
import { Design, DesignType } from '../types';
import { getDesignsDirPath } from '../utils';
import { writeDesign } from '../writeDesign';

/**
 * Creates a new, empty design.
 *
 * @param type - The design type.
 * @param name - The design name, defaults to the design type name.
 * @returns The new design.
 *
 * @dispatches 'designs:design:created'
 */
export async function createDesign(
  type: DesignType,
  name?: string,
): Promise<Design> {
  // Ensure the designs directory exists
  await Fs.ensureDir(getDesignsDirPath());

  const defaultMinHeights: Record<string, number | undefined> = {
    card: 200,
    list: 48,
  };

  // Generate a new design
  const design: Design = {
    type,
    id: uuid(),
    name: name || i18n.t(`designs.${type}.name`),
    created: new Date(),
    lastModified: new Date(),
    tree: {
      id: 'root',
      type: 'root',
      style: {
        ...DefaultContainerElementStyle,
        borderRadiusTopLeft: 8,
        borderRadiusTopRight: 8,
        borderRadiusBottomRight: 8,
        borderRadiusBottomLeft: 8,
        minHeight: defaultMinHeights[type],
      },
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
