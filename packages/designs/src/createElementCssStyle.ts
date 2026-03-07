import { CSSProperties } from 'react';
import { ContentColors } from '@minddrop/ui-theme';
import { elementConfigs } from './design-element-configs';
import {
  ContainerElementStyle,
  EditorElementStyle,
  IconElementStyle,
  ImageElementStyle,
  ImageViewerElementStyle,
  TextElementStyle,
  WebviewElementStyle,
} from './styles';
import type { StyleCategory } from './types';

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

function getBackgroundColorCss(color: string, opacity?: number): string {
  if (color === 'transparent') {
    return 'transparent';
  }

  const colorValue = getContentColorCss(color, 100, 'var(--surface-paper)');

  // Apply opacity to the background color value so it doesn't
  // affect child element opacity
  if (opacity !== undefined && opacity < 1) {
    if (opacity <= 0) {
      return 'transparent';
    }

    const transparentPercent = Math.round((1 - opacity) * 100);

    return `color-mix(in srgb, ${colorValue}, transparent ${transparentPercent}%)`;
  }

  return colorValue;
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

// -- Shared CSS helpers for repeated style patterns --

/**
 * Resolves margin style properties to CSS values.
 */
function resolveMarginCss(style: {
  'margin-top': number;
  'margin-right': number;
  'margin-bottom': number;
  'margin-left': number;
}): CSSProperties {
  return {
    marginTop: style['margin-top'] ? `${style['margin-top']}rem` : undefined,
    marginRight: style['margin-right']
      ? `${style['margin-right']}rem`
      : undefined,
    marginBottom: style['margin-bottom']
      ? `${style['margin-bottom']}rem`
      : undefined,
    marginLeft: style['margin-left'] ? `${style['margin-left']}rem` : undefined,
  };
}

/**
 * Resolves border style properties to CSS values.
 */
function resolveBorderCss(style: {
  borderStyle: string;
  borderColor: string;
  borderWidth: number;
  borderRadiusTopLeft: number;
  borderRadiusTopRight: number;
  borderRadiusBottomRight: number;
  borderRadiusBottomLeft: number;
}): CSSProperties {
  return {
    borderStyle: style.borderStyle,
    borderWidth: `${style.borderWidth}px`,
    borderColor: getBorderColorCss(style.borderColor),
    borderRadius: `${style.borderRadiusTopLeft}px ${style.borderRadiusTopRight}px ${style.borderRadiusBottomRight}px ${style.borderRadiusBottomLeft}px`,
  };
}

/**
 * Resolves sizing properties (width/height/maxWidth/maxHeight) to
 * CSS values. When fallback is provided, it is used when the value
 * is 0; otherwise the property is left undefined.
 */
function resolveSizingCss(
  style: {
    width: number;
    height: number;
    maxWidth: number;
    maxHeight: number;
    widthUnit: string;
    maxWidthUnit: string;
  },
  fallback?: string,
): CSSProperties {
  const widthUnit = style.widthUnit || 'px';
  const maxWidthUnit = style.maxWidthUnit || 'px';

  return {
    width: style.width > 0 ? `${style.width}${widthUnit}` : fallback,
    height: style.height > 0 ? `${style.height}px` : undefined,
    maxWidth:
      style.maxWidth > 0 ? `${style.maxWidth}${maxWidthUnit}` : fallback,
    maxHeight: style.maxHeight > 0 ? `${style.maxHeight}px` : undefined,
  };
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
    maxWidth: style['max-width'] > 0 ? `${style['max-width']}px` : undefined,
    overflowWrap: 'anywhere',
    opacity: style.opacity,
    ...resolveMarginCss(style),
    display:
      style['margin-top'] || style['margin-bottom'] ? 'block' : undefined,
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
  const cssStyle: CSSProperties = {
    display: 'flex',
    flexDirection: style.direction,
    alignItems: style.alignItems,
    justifyContent: style.justifyContent,
    flexWrap: style.wrap ? 'wrap' : 'nowrap',
    alignSelf: style.stretch ? 'stretch' : undefined,
    gap: `${style.gap}px`,
    ...resolveSizingCss(style),
    paddingTop: style.paddingTop ? `${style.paddingTop}rem` : undefined,
    paddingRight: style.paddingRight ? `${style.paddingRight}rem` : undefined,
    paddingBottom: style.paddingBottom
      ? `${style.paddingBottom}rem`
      : undefined,
    paddingLeft: style.paddingLeft ? `${style.paddingLeft}rem` : undefined,
    minHeight: style.minHeight ? `${style.minHeight}px` : undefined,
    fontFamily: resolveFontFamily(style['font-family']),
    fontWeight: style['font-weight'],
    color: getContentColorCss(style.color, 900, 'inherit'),
    // When gradient overlay is active, background color goes on the
    // overlay so it gets masked by the gradient too.
    // Opacity is applied to the background color (not the element)
    // so that child elements are not affected.
    backgroundColor:
      style.backdropBlurGradient && style.backdropBlur > 0
        ? 'transparent'
        : getBackgroundColorCss(style.backgroundColor, style.opacity),
    ...resolveBorderCss(style),
    overflow: 'hidden',
  };

  // Background image sizing (image URL applied in renderers via useImageSrc)
  if (style.backgroundImage) {
    cssStyle.backgroundSize = style.backgroundImageFit;
    cssStyle.backgroundPosition = 'center';
    cssStyle.backgroundRepeat = 'no-repeat';
  }

  // When gradient is enabled, backdrop effects go on a separate overlay
  // div (see createBackdropGradientOverlayStyle). Otherwise apply directly.
  const hasGradient = style.backdropBlurGradient && style.backdropBlur > 0;

  if (!hasGradient) {
    // Build backdrop-filter from blur and brightness
    const backdropFilters: string[] = [];

    if (style.backdropBlur > 0) {
      backdropFilters.push(`blur(${style.backdropBlur}px)`);
    }

    if (style.backdropBrightness !== 100) {
      backdropFilters.push(`brightness(${style.backdropBrightness}%)`);
    }

    if (backdropFilters.length > 0) {
      const filterValue = backdropFilters.join(' ');

      cssStyle.backdropFilter = filterValue;
      cssStyle.WebkitBackdropFilter = filterValue;
    }
  }

  return cssStyle;
}

const gradientDirectionMap: Record<string, string> = {
  'to-top': 'to top',
  'to-bottom': 'to bottom',
  'to-left': 'to left',
  'to-right': 'to right',
};

/**
 * Returns CSS for an absolutely positioned overlay div that
 * applies backdrop-filter with a gradient mask. Used when
 * backdropBlurGradient is enabled so the mask doesn't clip
 * the container's content.
 *
 * Returns null when no gradient overlay is needed.
 */
export function createBackdropGradientOverlayStyle(
  style: ContainerElementStyle,
): CSSProperties | null {
  // Only needed when gradient is active
  if (!style.backdropBlurGradient || style.backdropBlur <= 0) {
    return null;
  }

  // Build backdrop-filter from blur and brightness
  const backdropFilters: string[] = [];

  if (style.backdropBlur > 0) {
    backdropFilters.push(`blur(${style.backdropBlur}px)`);
  }

  if (style.backdropBrightness !== 100) {
    backdropFilters.push(`brightness(${style.backdropBrightness}%)`);
  }

  const filterValue = backdropFilters.join(' ');

  // Build gradient mask
  const cssDirection =
    gradientDirectionMap[style.backdropBlurGradientDirection];
  const extent = style.backdropBlurGradientExtent;
  const maskValue = `linear-gradient(${cssDirection}, black 0%, transparent ${extent}%)`;

  return {
    position: 'absolute',
    inset: 0,
    backgroundColor: getBackgroundColorCss(
      style.backgroundColor,
      style.opacity,
    ),
    backdropFilter: filterValue,
    WebkitBackdropFilter: filterValue,
    maskImage: maskValue,
    WebkitMaskImage: maskValue,
    pointerEvents: 'none',
    zIndex: -1,
  };
}

export function createIconCssStyle(style: IconElementStyle): CSSProperties {
  return {
    // Use container size if set, otherwise fall back to icon size
    width: style.containerSize > 0 ? `${style.containerSize}px` : undefined,
    height: style.containerSize > 0 ? `${style.containerSize}px` : undefined,
    backgroundColor: getBackgroundColorCss(style.containerBackgroundColor),
    borderRadius: style.containerRound
      ? '50%'
      : style.containerBorderRadius > 0
        ? `${style.containerBorderRadius}px`
        : undefined,
    opacity: style.opacity,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...resolveMarginCss(style),
  };
}

export function createImageCssStyle(style: ImageElementStyle): CSSProperties {
  return {
    ...resolveSizingCss(style, '100%'),
    objectFit: style.objectFit,
    ...resolveBorderCss(style),
    // Round overrides border-radius to make a circle
    ...(style.round && { borderRadius: '50%' }),
    opacity: style.opacity,
    ...resolveMarginCss(style),
  };
}

export function createWebviewCssStyle(
  style: WebviewElementStyle,
): CSSProperties {
  return {
    ...resolveSizingCss(style, '100%'),
    ...resolveBorderCss(style),
    opacity: style.opacity,
    ...resolveMarginCss(style),
  };
}

export function createImageViewerCssStyle(
  style: ImageViewerElementStyle,
): CSSProperties {
  return {
    ...resolveSizingCss(style, '100%'),
    ...resolveBorderCss(style),
    opacity: style.opacity,
    ...resolveMarginCss(style),
  };
}

export function createEditorCssStyle(style: EditorElementStyle): CSSProperties {
  return {
    ...resolveSizingCss(style, '100%'),
    paddingTop: style.paddingTop ? `${style.paddingTop}rem` : undefined,
    paddingRight: style.paddingRight ? `${style.paddingRight}rem` : undefined,
    paddingBottom: style.paddingBottom
      ? `${style.paddingBottom}rem`
      : undefined,
    paddingLeft: style.paddingLeft ? `${style.paddingLeft}rem` : undefined,
    ...resolveBorderCss(style),
    fontFamily: resolveFontFamily(style['font-family']),
    fontWeight: style['font-weight'],
    color: getContentColorCss(style.color, 900, 'inherit'),
    opacity: style.opacity,
    ...resolveMarginCss(style),
  };
}

/**
 * Returns background-image CSS that layers a color overlay on top
 * of a background image when both are present. When only an image
 * is set (no meaningful color), returns just the image URL. When no
 * image is set, returns nothing so background-color applies normally.
 */
export function getBackgroundImageStyle(
  imageSrc: string | null,
  backgroundColor: CSSProperties['backgroundColor'],
): CSSProperties {
  if (!imageSrc) {
    return {};
  }

  // When a non-transparent background color is set, layer it as a
  // solid gradient on top of the image
  if (backgroundColor && backgroundColor !== 'transparent') {
    return {
      backgroundImage: `linear-gradient(${backgroundColor}, ${backgroundColor}), url(${imageSrc})`,
      backgroundColor: 'transparent',
    };
  }

  return { backgroundImage: `url(${imageSrc})` };
}

// Maps style categories to their CSS generator functions
const styleCategoryFns: Record<StyleCategory, (style: never) => CSSProperties> =
  {
    text: createTextCssStyle as (style: never) => CSSProperties,
    icon: createIconCssStyle as (style: never) => CSSProperties,
    image: createImageCssStyle as (style: never) => CSSProperties,
    'image-viewer': createImageViewerCssStyle as (
      style: never,
    ) => CSSProperties,
    editor: createEditorCssStyle as (style: never) => CSSProperties,
    webview: createWebviewCssStyle as (style: never) => CSSProperties,
    container: createContainerCssStyle as (style: never) => CSSProperties,
  };

// Build element type to style category lookup from configs
const typeToStyleCategory: Record<string, StyleCategory> = Object.fromEntries(
  elementConfigs.map((config) => [config.type, config.styleCategory]),
);

/**
 * Maps a design element's style object to a CSS-compatible
 * React style object. Uses the element config's styleCategory
 * to select the appropriate CSS generator.
 *
 * @param element - The design element (or any object with a type and style).
 * @returns A React CSSProperties object.
 */
export function createElementCssStyle(element: {
  type: string;
  style: unknown;
}): CSSProperties {
  const category = typeToStyleCategory[element.type];
  const styleFn = styleCategoryFns[category];

  return styleFn(element.style as never);
}
