import type { CSSProperties } from 'react';
import { TypographyStyle } from '../styles';
import { tokenCssVariable } from '../tokens';
import { marginCss, widthCss } from './cssBlocks';

/**
 * Emits CSS for a typography style. Omitted values emit nothing and
 * inherit.
 */
export function createTypographyCss(style: TypographyStyle): CSSProperties {
  const css: CSSProperties = {
    ...marginCss(style),
    ...widthCss(style),
  };

  // Emit each set typography token as its CSS variable reference
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

  if (style.letterSpacing) {
    css.letterSpacing = tokenCssVariable('letterSpacing', style.letterSpacing);
  }

  if (style.color) {
    css.color = tokenCssVariable('textColor', style.color);
  }

  // Emit the literal-value typography options
  if (style.textAlign) {
    css.textAlign = style.textAlign;
  }

  if (style.textTransform) {
    css.textTransform = style.textTransform;
  }

  if (style.italic) {
    css.fontStyle = 'italic';
  }

  if (style.underline) {
    css.textDecoration = 'underline';
  }

  // Truncation renders a line-clamped block
  if (style.truncate) {
    css.display = '-webkit-box';
    css.WebkitBoxOrient = 'vertical';
    css.WebkitLineClamp = style.truncate;
    css.overflow = 'hidden';
  }

  return css;
}
