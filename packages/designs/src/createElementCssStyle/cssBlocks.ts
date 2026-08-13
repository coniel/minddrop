import type { CSSProperties } from 'react';
import {
  BorderBlockStyle,
  HeightStyle,
  MarginStyle,
  PaddingStyle,
  WidthStyle,
} from '../styles';
import { tokenCssVariable } from '../tokens';

/**
 * Emits margin CSS for the set margin sides.
 */
export function marginCss(style: MarginStyle): CSSProperties {
  const css: CSSProperties = {};

  // Emit each set margin side as a space token reference
  if (style.marginTop) {
    css.marginTop = tokenCssVariable('space', style.marginTop);
  }

  if (style.marginRight) {
    css.marginRight = tokenCssVariable('space', style.marginRight);
  }

  if (style.marginBottom) {
    css.marginBottom = tokenCssVariable('space', style.marginBottom);
  }

  if (style.marginLeft) {
    css.marginLeft = tokenCssVariable('space', style.marginLeft);
  }

  return css;
}

/**
 * Emits padding CSS for the set padding sides.
 */
export function paddingCss(style: PaddingStyle): CSSProperties {
  const css: CSSProperties = {};

  // Emit each set padding side as a space token reference
  if (style.paddingTop) {
    css.paddingTop = tokenCssVariable('space', style.paddingTop);
  }

  if (style.paddingRight) {
    css.paddingRight = tokenCssVariable('space', style.paddingRight);
  }

  if (style.paddingBottom) {
    css.paddingBottom = tokenCssVariable('space', style.paddingBottom);
  }

  if (style.paddingLeft) {
    css.paddingLeft = tokenCssVariable('space', style.paddingLeft);
  }

  return css;
}

/**
 * Emits border and corner radius CSS. A border is only drawn when
 * `borderStyle` is set; width and color fall back to their default
 * tokens. `borderEdges` limits the border to specific sides.
 */
export function borderCss(style: BorderBlockStyle): CSSProperties {
  const css: CSSProperties = {};

  // Corner radius applies independently of the border itself
  if (style.borderRadius) {
    css.borderRadius = tokenCssVariable('radius', style.borderRadius);
  }

  // No border style means no border
  if (!style.borderStyle) {
    return css;
  }

  // Compose the border shorthand from tokens with defaults
  const width = tokenCssVariable('borderWidth', style.borderWidth ?? 'thin');
  const color = tokenCssVariable('borderColor', style.borderColor ?? 'default');
  const border = `${width} ${style.borderStyle} ${color}`;

  // Without an edge restriction the border draws on all sides
  if (!style.borderEdges || style.borderEdges.length === 0) {
    css.border = border;

    return css;
  }

  // Draw the border only on the restricted edges
  style.borderEdges.forEach((edge) => {
    switch (edge) {
      case 'top':
        css.borderTop = border;
        break;
      case 'right':
        css.borderRight = border;
        break;
      case 'bottom':
        css.borderBottom = border;
        break;
      case 'left':
        css.borderLeft = border;
        break;
    }
  });

  return css;
}

/**
 * Emits width CSS: `full` fills the parent, measures cap at
 * readable line lengths, `auto` leaves the browser default.
 */
export function widthCss(style: WidthStyle): CSSProperties {
  const css: CSSProperties = {};

  // Emit the width unless left automatic
  if (style.width === 'full') {
    css.width = '100%';
  } else if (style.width && style.width !== 'auto') {
    css.width = tokenCssVariable('measure', style.width);
  }

  // Emit the maximum width
  if (style.maxWidth) {
    css.maxWidth = tokenCssVariable('measure', style.maxWidth);
  }

  return css;
}

/**
 * Emits height CSS: `fill` grows into the remaining space of the
 * parent, size steps fix the box height.
 */
export function heightCss(style: HeightStyle): CSSProperties {
  const css: CSSProperties = {};

  if (style.height === 'fill') {
    // Grow into the remaining space; the zero minimum lets the
    // element shrink below its content size inside a flex parent
    css.flexGrow = 1;
    css.minHeight = 0;
  } else if (style.height) {
    css.height = tokenCssVariable('size', style.height);
  }

  return css;
}
