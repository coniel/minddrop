import type { CSSProperties } from 'react';
import { ContainerAlign, ContainerJustify, ContainerStyle } from '../styles';
import { tokenCssVariable } from '../tokens';
import { borderCss, marginCss, paddingCss, widthCss } from './cssBlocks';

/**
 * The fixed values behind the backdrop presets. A preset rather
 * than free values so containers cannot opt out of the vocabulary.
 */
const BackdropBlurAmount = '12px';
const BackdropFadeMask = 'linear-gradient(to bottom, black 40%, transparent)';

/**
 * Emits CSS for a container style. The background image itself is
 * applied by the renderer, which resolves the media file path; only
 * its fit and backdrop treatment emit here.
 */
export function createContainerCss(style: ContainerStyle): CSSProperties {
  const css: CSSProperties = {
    display: 'flex',
    flexDirection: style.direction ?? 'column',
    ...paddingCss(style),
    ...marginCss(style),
    ...borderCss(style),
    ...widthCss(style),
  };

  // Emit the child alignment options
  if (style.align) {
    css.alignItems = resolveFlexValue(style.align);
  }

  if (style.justify) {
    css.justifyContent = resolveFlexValue(style.justify);
  }

  if (style.wrap) {
    css.flexWrap = 'wrap';
  }

  if (style.gap) {
    css.gap = tokenCssVariable('space', style.gap);
  }

  // Emit the surface and elevation tokens
  if (style.background) {
    css.backgroundColor = tokenCssVariable('surfaceColor', style.background);
  }

  if (style.shadow) {
    css.boxShadow = tokenCssVariable('shadow', style.shadow);
  }

  if (style.minHeight) {
    css.minHeight = tokenCssVariable('size', style.minHeight);
  }

  // Emit the typography passthrough inherited by children
  if (style.fontFamily) {
    css.fontFamily = tokenCssVariable('fontFamily', style.fontFamily);
  }

  if (style.color) {
    css.color = tokenCssVariable('textColor', style.color);
  }

  return css;
}

/**
 * Emits the CSS a renderer applies to the backdrop overlay covering
 * a container's background image. Returns null when the container
 * has no backdrop treatment.
 */
export function createBackdropCss(style: ContainerStyle): CSSProperties | null {
  // No treatment, no overlay
  if (!style.backdrop) {
    return null;
  }

  const css: CSSProperties = {
    backdropFilter: `blur(${BackdropBlurAmount})`,
    WebkitBackdropFilter: `blur(${BackdropBlurAmount})`,
  };

  // The fade variant masks the frost out across the overlay
  if (style.backdrop === 'blur-fade') {
    css.maskImage = BackdropFadeMask;
    css.WebkitMaskImage = BackdropFadeMask;
  }

  return css;
}

/**
 * Maps an alignment option onto its flexbox value.
 */
function resolveFlexValue(
  value: ContainerAlign | ContainerJustify,
): CSSProperties['alignItems'] {
  if (value === 'start') {
    return 'flex-start';
  }

  if (value === 'end') {
    return 'flex-end';
  }

  return value;
}
