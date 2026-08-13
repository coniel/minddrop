import type { CSSProperties } from 'react';
import { AspectRatio, ImageStyle } from '../styles';
import { borderCss, heightCss, marginCss, widthCss } from './cssBlocks';

/**
 * Emits CSS for an image style.
 */
export function createImageCss(style: ImageStyle): CSSProperties {
  const css: CSSProperties = {
    ...marginCss(style),
    ...borderCss(style),
    ...widthCss(style),
    ...heightCss(style),
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

/**
 * Maps an aspect preset onto its CSS ratio.
 */
export function resolveAspectRatio(aspectRatio: AspectRatio): string {
  if (aspectRatio === 'square') {
    return '1 / 1';
  }

  if (aspectRatio === 'landscape') {
    return '4 / 3';
  }

  if (aspectRatio === 'portrait') {
    return '3 / 4';
  }

  return '16 / 9';
}
