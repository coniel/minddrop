import type { CSSProperties } from 'react';
import { BadgeStyle } from '../styles';
import { tokenCssVariable } from '../tokens';
import { marginCss, resolveBorderColorToken, textColorCss } from './cssBlocks';

/**
 * Emits CSS for a badge style.
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

  // The text colour treatment, adjusted by its emphasis
  Object.assign(css, textColorCss(style));

  if (style.background) {
    css.backgroundColor = tokenCssVariable('surfaceColor', style.background);
  }

  // Badge borders always draw thin
  if (style.borderStyle) {
    const color = tokenCssVariable(
      'borderColor',
      resolveBorderColorToken(style.borderColor, style.borderEmphasis),
    );

    css.border = `${tokenCssVariable('borderWidth', 'thin')} ${style.borderStyle} ${color}`;
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
