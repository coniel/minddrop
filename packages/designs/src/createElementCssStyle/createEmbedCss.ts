import type { CSSProperties } from 'react';
import { ContainerDirection, EmbedStyle } from '../styles';
import { tokenCssVariable } from '../tokens';
import {
  borderCss,
  heightCss,
  marginCss,
  maxWidthCss,
  radiusCss,
  resolveAspectRatio,
} from './cssBlocks';

/**
 * Emits CSS for an embedded frame style (views, webviews and image
 * viewers).
 */
export function createEmbedCss(
  style: EmbedStyle,
  parentDirection?: ContainerDirection,
): CSSProperties {
  const css: CSSProperties = {
    ...marginCss(style),
    ...borderCss(style),
    ...radiusCss(style),
    ...maxWidthCss(style),
    ...heightCss(style, parentDirection),
  };

  if (style.background) {
    css.backgroundColor = tokenCssVariable('surfaceColor', style.background);
  }

  // Emit the aspect preset as a constant CSS ratio
  if (style.aspectRatio) {
    css.aspectRatio = resolveAspectRatio(style.aspectRatio);
  }

  return css;
}
