import type { CSSProperties } from 'react';
import { DesignElement } from '../design-element-configs';
import { resolveElementStyle } from '../utils/resolveElementStyle';
import { createBadgeCss } from './createBadgeCss';
import { createContainerCss } from './createContainerCss';
import { createEditorCss } from './createEditorCss';
import { createEmbedCss } from './createEmbedCss';
import { createIconCss } from './createIconCss';
import { createImageCss } from './createImageCss';
import { createTypographyCss } from './createTypographyCss';

/**
 * Emits the CSS for a design element: the element's effective style
 * (own style with role locked styles applied) rendered through the
 * style category generator of its type.
 *
 * @param element - The element to emit CSS for.
 * @returns The element's CSS properties.
 */
export function createElementCssStyle(element: DesignElement): CSSProperties {
  // Dispatch on the element type, narrowing the style shape
  switch (element.type) {
    case 'text':
    case 'formatted-text':
    case 'number':
    case 'date':
    case 'url':
      return createTypographyCss(resolveElementStyle(element));
    case 'badges':
      return createBadgeCss(resolveElementStyle(element));
    case 'root':
    case 'container':
    case 'page-panel':
      return createContainerCss(resolveElementStyle(element));
    case 'image':
      return createImageCss(resolveElementStyle(element));
    case 'icon':
      return createIconCss(resolveElementStyle(element));
    case 'image-viewer':
    case 'webview':
    case 'view':
      return createEmbedCss(resolveElementStyle(element));
    case 'editor':
      return createEditorCss(resolveElementStyle(element));
  }
}
