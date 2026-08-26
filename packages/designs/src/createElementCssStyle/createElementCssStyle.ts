import type { CSSProperties } from 'react';
import { DesignElementStyleSource } from '../design-element-configs';
import {
  BadgeStyle,
  ContainerDirection,
  EditorStyle,
  EmbedStyle,
  FieldStyle,
  IconStyle,
  ImageStyle,
  TypographyStyle,
} from '../styles';
import { LayoutType } from '../types';
import { getElementStyleCategory } from '../utils/getElementStyleCategory';
import { resolveElementStyle } from '../utils/resolveElementStyle';
import { createBadgeCss } from './createBadgeCss';
import { createContainerCss } from './createContainerCss';
import { createEditorCss } from './createEditorCss';
import { createEmbedCss } from './createEmbedCss';
import { createFieldCss } from './createFieldCss';
import { createIconCss } from './createIconCss';
import { createImageCss } from './createImageCss';
import { createRootCss } from './createRootCss';
import { createTypographyCss } from './createTypographyCss';

/**
 * Emits the CSS for a design element: the element's effective style
 * (own style with role locked styles applied) rendered through the
 * style category generator of its type.
 *
 * @param element - The element to emit CSS for.
 * @param parentDirection - The direction the containing element
 *   stacks its children in, which decides how a filled height is
 *   taken. Defaults to a column.
 * @param layoutType - The type of the layout the element is in,
 *   which context-adapting role styles resolve against.
 * @returns The element's CSS properties.
 */
export function createElementCssStyle(
  element: DesignElementStyleSource,
  parentDirection?: ContainerDirection,
  layoutType?: LayoutType,
): CSSProperties {
  // Dispatch on the element type, narrowing the style shape
  switch (element.type) {
    case 'text':
      return createTypographyCss(resolveElementStyle(element, layoutType));
    case 'property':
      return createPropertyElementCss(element, parentDirection, layoutType);
    case 'root':
      return createRootCss(
        resolveElementStyle(element, layoutType),
        parentDirection,
        element.layoutType ?? layoutType,
      );
    case 'container':
    case 'page-panel':
      return createContainerCss(
        resolveElementStyle(element, layoutType),
        parentDirection,
      );
    case 'view':
      return createEmbedCss(
        resolveElementStyle(element, layoutType),
        parentDirection,
      );
  }
}

/**
 * Emits the CSS for a property element, dispatching on the style
 * category its selected presentation variant declares. The variant
 * decides the style shape at render time, which the persisted
 * element type cannot narrow, so each branch names the shape its
 * generator reads.
 */
function createPropertyElementCss(
  element: DesignElementStyleSource,
  parentDirection?: ContainerDirection,
  layoutType?: LayoutType,
): CSSProperties {
  const style = resolveElementStyle(element, layoutType);

  switch (getElementStyleCategory(element)) {
    case 'badge':
      return createBadgeCss(style as BadgeStyle);
    case 'image':
      return createImageCss(style as ImageStyle, parentDirection);
    case 'icon':
      return createIconCss(style as IconStyle);
    case 'embed':
      return createEmbedCss(style as EmbedStyle, parentDirection);
    case 'field':
      return createFieldCss(style as FieldStyle);
    case 'editor':
      return createEditorCss(style as EditorStyle);
    default:
      return createTypographyCss(style as TypographyStyle);
  }
}
