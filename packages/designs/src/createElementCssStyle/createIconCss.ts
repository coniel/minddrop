import type { CSSProperties } from 'react';
import { IconStyle } from '../styles';
import { tokenCssVariable } from '../tokens';
import { marginCss } from './cssBlocks';

/**
 * Emits CSS for the icon itself. The optional box around the icon
 * is emitted separately by `createIconContainerCss`.
 */
export function createIconCss(style: IconStyle): CSSProperties {
  const css: CSSProperties = {
    ...marginCss(style),
  };

  // Icons are square, sized by the icon size token
  if (style.size) {
    css.width = tokenCssVariable('iconSize', style.size);
    css.height = tokenCssVariable('iconSize', style.size);
  }

  if (style.color) {
    css.color = tokenCssVariable('textColor', style.color);
  }

  return css;
}

/**
 * Emits the CSS a renderer applies to the box around an icon.
 * Returns null when the style has no container.
 */
export function createIconContainerCss(style: IconStyle): CSSProperties | null {
  // No container, no box
  if (!style.container) {
    return null;
  }

  const css: CSSProperties = {};

  // Emit each set container token as its CSS variable reference
  if (style.container.background) {
    css.backgroundColor = tokenCssVariable(
      'surfaceColor',
      style.container.background,
    );
  }

  if (style.container.radius) {
    css.borderRadius = tokenCssVariable('radius', style.container.radius);
  }

  if (style.container.padding) {
    css.padding = tokenCssVariable('space', style.container.padding);
  }

  return css;
}
