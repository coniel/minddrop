import {
  DesignElement,
  DesignElementSettings,
  ElementBackground,
  ElementPadding,
  FontFamily,
  VerticalAlign,
} from '@minddrop/designs-next';
import { resolveCornerRadius } from '../resolveCornerRadius';
import { resolveElementColor } from '../resolveElementColor';

// The theme's content font stack for each family
const FontFamilyValues: Record<FontFamily, string> = {
  sans: 'var(--font-sans)',
  serif: 'var(--font-serif)',
  mono: 'var(--font-mono)',
};

// The theme's surface token for each background
const BackgroundValues: Record<ElementBackground, string> = {
  subtle: 'var(--surface-subtle)',
  accent: 'var(--surface-accent)',
  'solid-accent': 'var(--surface-solid-accent)',
};

// Where a column's content sits for each vertical alignment
const VerticalAlignValues: Record<VerticalAlign, string> = {
  top: 'flex-start',
  middle: 'center',
  bottom: 'flex-end',
};

/**
 * Resolves an element's settings to the styles they render as.
 * A setting the element does not carry falls back to the given
 * default, and one neither carries is left out.
 *
 * @param element - The element to resolve styles for.
 * @param defaults - The settings the element's type renders at.
 * @param custom - Styles spread over the resolved ones.
 * @returns The element's styles.
 */
export function resolveElementStyle(
  element: DesignElement & DesignElementSettings,
  defaults: DesignElementSettings = {},
  custom: React.CSSProperties = {},
): React.CSSProperties {
  // Each setting, falling back to the type's default. A cleared
  // setting is absent rather than undefined, so the fallback holds.
  const fontFamily = element.fontFamily ?? defaults.fontFamily;
  const background = element.background ?? defaults.background;
  const cornerRadius = element.cornerRadius ?? defaults.cornerRadius;
  const verticalAlign = element.verticalAlign ?? defaults.verticalAlign;

  return {
    fontFamily: fontFamily && FontFamilyValues[fontFamily],
    fontSize: element.fontSize ?? defaults.fontSize,
    lineHeight: element.lineHeight ?? defaults.lineHeight,
    fontWeight: element.fontWeight ?? defaults.fontWeight,
    fontStyle: (element.italic ?? defaults.italic) ? 'italic' : undefined,
    textDecorationLine: resolveTextDecoration(element, defaults),
    textAlign: element.textAlign ?? defaults.textAlign,
    justifyContent: verticalAlign && VerticalAlignValues[verticalAlign],
    color: resolveElementColor(element.textColor ?? defaults.textColor),
    backgroundColor: background && BackgroundValues[background],
    borderRadius: cornerRadius && resolveCornerRadius(cornerRadius),
    padding: resolvePadding(element.padding),
    ...custom,
  };
}

/**
 * Resolves an element's padding into a CSS padding shorthand. Sides
 * with no padding are set to 0.
 *
 * @param padding - The element's padding.
 * @returns The shorthand, or undefined if the element has no padding.
 */
function resolvePadding(
  padding: ElementPadding | undefined,
): string | undefined {
  if (!padding) {
    return undefined;
  }

  return [padding.top, padding.right, padding.bottom, padding.left]
    .map((amount) => `${amount ?? 0}px`)
    .join(' ');
}

/**
 * Resolves the decoration drawn on the text, which carries both an
 * underline and a strike where both are set.
 *
 * @param element - The element's settings.
 * @param defaults - The settings the element's type renders at.
 * @returns The decoration, or undefined where the text carries none.
 */
function resolveTextDecoration(
  element: DesignElementSettings,
  defaults: DesignElementSettings,
): string | undefined {
  const lines = [
    (element.underline ?? defaults.underline) ? 'underline' : undefined,
    (element.strikethrough ?? defaults.strikethrough)
      ? 'line-through'
      : undefined,
  ].filter(Boolean);

  return lines.length > 0 ? lines.join(' ') : undefined;
}
