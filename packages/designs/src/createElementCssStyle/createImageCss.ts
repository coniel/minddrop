import type { CSSProperties } from 'react';
import { ContainerDirection, ImageStyle } from '../styles';
import {
  borderCss,
  heightCss,
  marginCss,
  radiusCss,
  resolveAspectRatio,
} from './cssBlocks';

/**
 * Emits CSS for an image style.
 */
export function createImageCss(
  style: ImageStyle,
  parentDirection?: ContainerDirection,
): CSSProperties {
  const css: CSSProperties = {
    ...marginCss(style),
    ...borderCss(style),
    ...radiusCss(style),
    ...heightCss(style, parentDirection),
    // Images have no width of their own: they span their container
    width: '100%',
  };

  // Emit the aspect preset as a constant CSS ratio
  if (style.aspectRatio) {
    css.aspectRatio = resolveAspectRatio(style.aspectRatio);
  }

  if (style.objectFit) {
    css.objectFit = style.objectFit;
  }

  return css;
}
