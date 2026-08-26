import type { CSSProperties } from 'react';
import { FieldStyle } from '../styles';
import { tokenCssVariable } from '../tokens';
import {
  backgroundCss,
  borderCss,
  marginCss,
  maxWidthCss,
  paddingCss,
  radiusCss,
  textColorCss,
} from './cssBlocks';

/**
 * Emits CSS for an input field style: the field box chrome plus
 * the typography of the value inside it.
 */
export function createFieldCss(style: FieldStyle): CSSProperties {
  const css: CSSProperties = {
    ...paddingCss(style),
    ...marginCss(style),
    ...borderCss(style),
    ...radiusCss(style),
    ...maxWidthCss(style),
  };

  // Emit the field value typography
  if (style.fontFamily) {
    css.fontFamily = tokenCssVariable('fontFamily', style.fontFamily);
  }

  if (style.fontSize) {
    css.fontSize = tokenCssVariable('fontSize', style.fontSize);
  }

  if (style.fontWeight) {
    css.fontWeight = tokenCssVariable('fontWeight', style.fontWeight);
  }

  if (style.lineHeight) {
    css.lineHeight = tokenCssVariable('lineHeight', style.lineHeight);
  }

  // The text colour treatment, adjusted by its emphasis
  Object.assign(css, textColorCss(style));

  // The field box fill, which pairs a solid step with the
  // contrasting text colour
  Object.assign(css, backgroundCss(style));

  return css;
}
