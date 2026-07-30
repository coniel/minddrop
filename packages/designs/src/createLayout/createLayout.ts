import { Events } from '@minddrop/events';
import { createI18nKeyBuilder, i18n } from '@minddrop/i18n';
import { uuid } from '@minddrop/utils';
import { LayoutCreatedEvent, LayoutCreatedEventData } from '../events';
import { getDesign } from '../getDesign';
import { DefaultContainerElementStyle } from '../styles';
import { Layout, LayoutFrame, LayoutType } from '../types';
import { updateDesign } from '../updateDesign';

const layoutTypeI18nKey = createI18nKeyBuilder('designs.layouts.');

const defaultMinHeights: Record<LayoutType, number | undefined> = {
  card: 200,
  list: 48,
  page: undefined,
};

const defaultFrames: Record<LayoutType, LayoutFrame> = {
  card: { x: 0, y: 0, width: 380 },
  list: { x: 0, y: 0, width: 600 },
  page: { x: 0, y: 0, width: 800, height: 600 },
};

/**
 * Creates a new layout of the given type inside the specified design.
 *
 * @param designId - The ID of the parent design.
 * @param type - The layout type.
 * @param name - The layout name, defaults to the localized type label.
 * @param position - The frame position on the design canvas, defaults to the origin.
 * @returns The new layout.
 *
 * @dispatches 'designs:layout:created'
 *
 * @throws {DesignNotFoundError} If the parent design does not exist.
 */
export async function createLayout(
  designId: string,
  type: LayoutType,
  name?: string,
  position?: Pick<LayoutFrame, 'x' | 'y'>,
): Promise<Layout> {
  // Get the parent design
  const design = getDesign(designId);

  // Build the new layout
  const layout: Layout = {
    id: uuid(),
    type,
    name: name || i18n.t(layoutTypeI18nKey(type, 'label')),
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
    frame: { ...defaultFrames[type], ...position },
    created: new Date(),
    lastModified: new Date(),
  };

  // Append the layout to the parent design and persist
  await updateDesign(design.id, { layouts: [...design.layouts, layout] });

  // Dispatch a layout created event
  Events.dispatch<LayoutCreatedEventData>(LayoutCreatedEvent, layout);

  return layout;
}
