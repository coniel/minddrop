import type { CSSProperties } from 'react';
import {
  AspectRatio,
  BorderBlockStyle,
  BorderColor,
  BorderEmphasis,
  ContainerDirection,
  HeightStyle,
  MarginStyle,
  MaxWidthStyle,
  PaddingStyle,
} from '../styles';
import {
  BorderColorToken,
  BorderWidthToken,
  tokenCssVariable,
} from '../tokens';

// The border colour role behind each treatment and emphasis pair.
// Neutral maps to the pinned roles, accent to the schemable ones.
const BorderColorRoles: Record<
  BorderColor,
  Record<BorderEmphasis, BorderColorToken>
> = {
  neutral: {
    subtle: 'neutral-subtle',
    regular: 'neutral',
    strong: 'neutral-strong',
  },
  accent: {
    subtle: 'subtle',
    regular: 'default',
    strong: 'strong',
  },
};

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
 * Emits border CSS. A border is only drawn when `borderStyle` is
 * set: uniformly thin without per-side widths, or only on the
 * sides a width is set for. The corner radius is emitted
 * separately by `radiusCss`, since containers leave rounding to
 * the rendering context.
 */
export function borderCss(style: BorderBlockStyle): CSSProperties {
  const css: CSSProperties = {};

  // No border style means no border
  if (!style.borderStyle) {
    return css;
  }

  // Resolve the colour shared by every drawn side
  const color = tokenCssVariable(
    'borderColor',
    resolveBorderColorToken(style.borderColor, style.borderEmphasis),
  );

  // Composes a side's border value from its width token
  const border = (width: BorderWidthToken) =>
    `${tokenCssVariable('borderWidth', width)} ${style.borderStyle} ${color}`;

  const {
    borderTopWidth,
    borderRightWidth,
    borderBottomWidth,
    borderLeftWidth,
  } = style;

  // Without per-side widths the border draws uniformly thin
  if (
    !borderTopWidth &&
    !borderRightWidth &&
    !borderBottomWidth &&
    !borderLeftWidth
  ) {
    css.border = border('thin');

    return css;
  }

  // A width on every side at the same step collapses back into the
  // uniform shorthand
  if (
    borderTopWidth &&
    borderTopWidth === borderRightWidth &&
    borderTopWidth === borderBottomWidth &&
    borderTopWidth === borderLeftWidth
  ) {
    css.border = border(borderTopWidth);

    return css;
  }

  // Draw each side its width is set for
  if (borderTopWidth) {
    css.borderTop = border(borderTopWidth);
  }

  if (borderRightWidth) {
    css.borderRight = border(borderRightWidth);
  }

  if (borderBottomWidth) {
    css.borderBottom = border(borderBottomWidth);
  }

  if (borderLeftWidth) {
    css.borderLeft = border(borderLeftWidth);
  }

  return css;
}

/**
 * Emits the corner radius CSS, which applies independently of the
 * border itself.
 */
export function radiusCss(style: BorderBlockStyle): CSSProperties {
  const css: CSSProperties = {};

  // Emit the corner radius as a radius token reference
  if (style.borderRadius) {
    css.borderRadius = tokenCssVariable('radius', style.borderRadius);
  }

  return css;
}

/**
 * Resolves a border colour treatment and emphasis pair onto the
 * border colour role carrying that look, defaulting to the regular
 * neutral outline.
 */
export function resolveBorderColorToken(
  color?: BorderColor,
  emphasis?: BorderEmphasis,
): BorderColorToken {
  return BorderColorRoles[color ?? 'neutral'][emphasis ?? 'regular'];
}

/**
 * Emits width CSS. Elements are fluid, so only a measure capping
 * the width at a readable line length is emitted.
 */
export function maxWidthCss(style: MaxWidthStyle): CSSProperties {
  const css: CSSProperties = {};

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
export function heightCss(
  style: HeightStyle,
  parentDirection: ContainerDirection = 'column',
): CSSProperties {
  const css: CSSProperties = {};

  // A fixed height is the same however the parent stacks
  if (style.height !== 'fill') {
    if (style.height) {
      css.height = tokenCssVariable('size', style.height);
    }

    return css;
  }

  // Filling a parent which stacks its children in a row means
  // standing as tall as the row: growth there would widen the
  // element rather than heighten it
  if (parentDirection === 'row') {
    css.alignSelf = 'stretch';

    return css;
  }

  // Share the height with the other filling elements. The zero
  // basis makes the ratio govern the whole height rather than what
  // is left over once each has taken its content, and the zero
  // minimum lets the element shrink below its content.
  css.flexGrow = style.fillRatio ?? 1;
  css.flexBasis = 0;
  css.minHeight = 0;

  return css;
}

/**
 * Spaces a ratio out into the CSS value it emits.
 */
export function resolveAspectRatio(aspectRatio: AspectRatio): string {
  return aspectRatio.replace('/', ' / ');
}
