import { createI18nKeyBuilder, i18n } from '@minddrop/i18n';
import { entityId } from '@minddrop/utils';
import { DefaultContainerStyle } from '../../styles';
import { Layout, LayoutFrame, LayoutType } from '../../types';
import { defaultRootStyle } from '../defaultRootStyle';

const layoutTypeI18nKey = createI18nKeyBuilder('designs.layouts.');

// Default canvas frames per layout type. Pages and spaces have a
// fixed height; cards and lists are content sized.
const defaultFrames: Record<LayoutType, LayoutFrame> = {
  card: { x: 0, y: 0, width: 380 },
  list: { x: 0, y: 0, width: 600 },
  page: { x: 0, y: 0, width: 800, height: 600 },
  space: { x: 0, y: 0, width: 800, height: 600 },
};

export interface BuildLayoutOptions {
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
 * Builds a new layout object of the given type with an empty root
 * tree, without persisting it anywhere.
 *
 * @param type - The layout type.
 * @param options - The layout name and canvas position.
 * @returns The new layout.
 */
export function buildLayout(
  type: LayoutType,
  options: BuildLayoutOptions = {},
): Layout {
  // Build the layout with an empty root tree. The root carries
  // the layout type, which decides its default background treatment
  return {
    id: entityId('layout'),
    type,
    name: options.name || i18n.t(layoutTypeI18nKey(type, 'name')),
    tree: {
      id: 'root',
      type: 'root',
      layoutType: type,
      style: { ...DefaultContainerStyle, ...defaultRootStyle(type) },
      children: [],
    },
    frame: { ...defaultFrames[type], ...options.position },
    created: new Date(),
    lastModified: new Date(),
  };
}
