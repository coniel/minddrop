import { CSSProperties } from 'react';
import { ContentColors } from '@minddrop/theme';
import {
  ContainerElementStyle,
  ImageElementStyle,
  TextElementStyle,
} from './styles';

const colorNames: string[] = ContentColors;

function getContentColorCss(
  color: string,
  shade: number,
  fallback: string,
): string {
  if (color === 'inherit') {
    return 'inherit';
  }

  if (color === 'default' || !colorNames.includes(color)) {
    return fallback;
  }

  return `var(--${color}-${shade})`;
}

function getBackgroundColorCss(color: string): string {
  if (color === 'transparent') {
    return 'transparent';
  }

  return getContentColorCss(color, 100, 'var(--surface-paper)');
}

function getBorderColorCss(color: string): string {
  return getContentColorCss(color, 600, 'var(--surface-paper)');
}

function resolveFontFamily(family: string): string {
  if (family === 'inherit') {
    return 'inherit';
  }

  return `var(--font-${family})`;
}

export function createTextCssStyle(style: TextElementStyle): CSSProperties {
  const cssStyle: CSSProperties = {
    fontFamily: resolveFontFamily(style['font-family']),
    fontSize: `${style['font-size']}rem`,
    fontWeight: style['font-weight'],
    lineHeight: style['line-height'],
    letterSpacing: `${style['letter-spacing']}em`,
    textAlign: style['text-align'],
    textTransform: style['text-transform'],
    color: getContentColorCss(style.color, 900, 'inherit'),
    fontStyle: style.italic ? 'italic' : 'normal',
    textDecoration: style.underline ? 'underline' : 'none',
    opacity: style.opacity,
  };

  if (style.truncate > 0) {
    cssStyle.display = '-webkit-box';
    cssStyle.WebkitLineClamp = style.truncate;
    cssStyle.WebkitBoxOrient = 'vertical';
    cssStyle.overflow = 'hidden';
  }

  return cssStyle;
}

export function createContainerCssStyle(
  style: ContainerElementStyle,
): CSSProperties {
  return {
    display: 'flex',
    flexDirection: style.direction,
    alignItems: style.alignItems,
    justifyContent: style.justifyContent,
    flexWrap: style.wrap ? 'wrap' : 'nowrap',
    gap: `${style.gap}px`,
    padding: style.padding ? `${style.padding}px` : undefined,
    minHeight: style.minHeight ? `${style.minHeight}px` : undefined,
    fontFamily: resolveFontFamily(style['font-family']),
    fontWeight: style['font-weight'],
    color: getContentColorCss(style.color, 900, 'inherit'),
    backgroundColor: getBackgroundColorCss(style.backgroundColor),
    borderStyle: style.borderStyle,
    borderWidth: `${style.borderWidth}px`,
    borderColor: getBorderColorCss(style.borderColor),
    borderRadius: `${style.borderRadius}px`,
    opacity: style.opacity,
  };
}

export function createImageCssStyle(style: ImageElementStyle): CSSProperties {
  return {
    borderStyle: style.borderStyle,
    borderWidth: `${style.borderWidth}px`,
    borderColor: getBorderColorCss(style.borderColor),
    borderRadius: `${style.borderRadius}px`,
    opacity: style.opacity,
  };
}

/**
 * An element with a type and style, used as input for
 * `createElementCssStyle`. Accepts both `DesignElement`
 * and flat element types.
 */
export type StylableElement =
  | { type: 'text' | 'formatted-text' | 'number'; style: TextElementStyle }
  | { type: 'image'; style: ImageElementStyle }
  | { type: 'root' | 'container'; style: ContainerElementStyle };

/**
 * Maps a design element's style object to a CSS-compatible
 * React style object.
 *
 * @param element - The design element (or any object with a type and style).
 * @returns A React CSSProperties object.
 */
export function createElementCssStyle(element: StylableElement): CSSProperties {
  switch (element.type) {
    case 'text':
    case 'formatted-text':
    case 'number':
      return createTextCssStyle(element.style);
    case 'image':
      return createImageCssStyle(element.style);
    case 'root':
    case 'container':
      return createContainerCssStyle(element.style);
  }
}
