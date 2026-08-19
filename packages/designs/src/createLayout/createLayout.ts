import { createI18nKeyBuilder, i18n } from '@minddrop/i18n';
import { InvalidParameterError, entityId } from '@minddrop/utils';
import { DesignTypeLayoutTypes } from '../constants';
import { getDesign } from '../getDesign';
import { DefaultContainerStyle, RootStyle } from '../styles';
import { Layout, LayoutFrame, LayoutType } from '../types';
import { updateDesign } from '../updateDesign';

const layoutTypeI18nKey = createI18nKeyBuilder('designs.layouts.');

// Default canvas frames per layout type. Pages and spaces have a
// fixed height; cards and lists are content sized.
const defaultFrames: Record<LayoutType, LayoutFrame> = {
  card: { x: 0, y: 0, width: 380 },
  list: { x: 0, y: 0, width: 600 },
  page: { x: 0, y: 0, width: 800, height: 600 },
  space: { x: 0, y: 0, width: 800, height: 600 },
};

export interface CreateLayoutOptions {
  /**
   * The layout type. Must be valid for the parent design's type.
   */
  type: LayoutType;

  /**
   * The layout name. Defaults to the localized type name.
   */
  name?: string;

  /**
   * The frame position on the design canvas. Defaults to the origin.
   */
  position?: Pick<LayoutFrame, 'x' | 'y'>;
}

/**
 * Creates a new layout inside the specified design.
 *
 * @param designId - The ID of the parent design.
 * @param options - The layout type, name and canvas position.
 * @returns The new layout.
 *
 * @throws {DesignNotFoundError} If the parent design does not exist.
 * @throws {InvalidParameterError} If the layout type is not valid for the design type.
 */
export async function createLayout(
  designId: string,
  options: CreateLayoutOptions,
): Promise<Layout> {
  // Get the parent design
  const design = getDesign(designId);

  // Ensure the layout type is valid for the design type
  if (!DesignTypeLayoutTypes[design.type].includes(options.type)) {
    throw new InvalidParameterError(
      `Cannot create a ${options.type} layout in a ${design.type} design.`,
    );
  }

  // Build the new layout with an empty root tree. The root carries
  // the layout type, which decides its default background treatment
  const layout: Layout = {
    id: entityId('layout'),
    type: options.type,
    name: options.name || i18n.t(layoutTypeI18nKey(options.type, 'name')),
    tree: {
      id: 'root',
      type: 'root',
      layoutType: options.type,
      style: { ...DefaultContainerStyle, ...defaultRootStyle(options.type) },
      children: [],
    },
    frame: { ...defaultFrames[options.type], ...options.position },
    created: new Date(),
    lastModified: new Date(),
  };

  // Append the layout to the parent design and persist
  await updateDesign(design.id, { layouts: [...design.layouts, layout] });

  return layout;
}

/**
 * Resolves the default style values of a layout type's root:
 * full-screen types carry a content gutter, which stays
 * user-editable like any other style value. Seeded at creation and
 * restored by the studio's styling reset.
 */
export function defaultRootStyle(type?: LayoutType): RootStyle {
  // A page's content keeps a gutter from the screen edges
  if (type === 'page' || type === 'space') {
    return { contentPadding: '4' };
  }

  return {};
}
