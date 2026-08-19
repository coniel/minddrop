import type { CSSProperties } from 'react';
import { DesignElementStyleSource } from '../design-element-configs';
import { ContainerDirection } from '../styles';
import { LayoutType } from '../types';
import { resolveElementStyle } from '../utils/resolveElementStyle';
import { createBadgeCss } from './createBadgeCss';
import { createContainerCss } from './createContainerCss';
import { createEditorCss } from './createEditorCss';
import { createEmbedCss } from './createEmbedCss';
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
    case 'formatted-text':
    case 'number':
    case 'date':
    case 'url':
      return createTypographyCss(resolveElementStyle(element, layoutType));
    case 'badges':
      return createBadgeCss(resolveElementStyle(element, layoutType));
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
    case 'image':
      return createImageCss(
        resolveElementStyle(element, layoutType),
        parentDirection,
      );
    case 'icon':
      return createIconCss(resolveElementStyle(element, layoutType));
    case 'image-viewer':
    case 'webview':
    case 'view':
      return createEmbedCss(
        resolveElementStyle(element, layoutType),
        parentDirection,
      );
    case 'editor':
      return createEditorCss(resolveElementStyle(element, layoutType));
  }
}
