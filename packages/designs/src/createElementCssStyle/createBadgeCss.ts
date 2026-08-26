import type { CSSProperties } from 'react';
import { BadgeStyle } from '../styles';
import { tokenCssVariable } from '../tokens';
import { marginCss } from './cssBlocks';

/**
 * Emits CSS for a badge style: the chip's type and shape. The fill
 * and label colour are applied by the renderer, which resolves them
 * from the select option each chip stands for.
 */
export function createBadgeCss(style: BadgeStyle): CSSProperties {
  const css: CSSProperties = {
    ...marginCss(style),
  };

  // Emit each set badge token as its CSS variable reference
  if (style.fontSize) {
    css.fontSize = tokenCssVariable('fontSize', style.fontSize);
  }

  if (style.fontWeight) {
    css.fontWeight = tokenCssVariable('fontWeight', style.fontWeight);
  }

  if (style.textTransform) {
    css.textTransform = style.textTransform;
  }

  if (style.borderRadius) {
    css.borderRadius = tokenCssVariable('radius', style.borderRadius);
  }

  // Badges use a uniform inner padding
  if (style.padding) {
    css.padding = tokenCssVariable('space', style.padding);
  }

  return css;
}
