import type { CSSProperties } from 'react';
import { EmbedStyle } from '../styles';
import { tokenCssVariable } from '../tokens';
import { resolveAspectRatio } from './createImageCss';
import { borderCss, heightCss, marginCss, widthCss } from './cssBlocks';

/**
 * Emits CSS for an embedded frame style (views, webviews and image
 * viewers).
 */
export function createEmbedCss(style: EmbedStyle): CSSProperties {
  const css: CSSProperties = {
    ...marginCss(style),
    ...borderCss(style),
    ...widthCss(style),
    ...heightCss(style),
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
