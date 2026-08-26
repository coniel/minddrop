import type { CSSProperties } from 'react';
import {
  BackdropBlur,
  BackdropFadeDirection,
  BackdropTint,
  BackdropTintStrength,
  ContainerAlign,
  ContainerDirection,
  ContainerJustify,
  ContainerStyle,
} from '../styles';
import { SurfaceColorToken, tokenCssVariable } from '../tokens';
import {
  backgroundCss,
  borderCss,
  heightCss,
  marginCss,
  maxWidthCss,
  paddingCss,
  resolveAspectRatio,
} from './cssBlocks';

/**
 * The blur radius behind each preset. Presets rather than free
 * values so containers cannot opt out of the vocabulary.
 */
const BackdropBlurAmounts: Record<BackdropBlur, string> = {
  subtle: '4px',
  regular: '12px',
  strong: '20px',
};

// The CSS gradient direction behind each fade direction option
const FadeDirections: Record<BackdropFadeDirection, string> = {
  'to-top': 'to top',
  'to-bottom': 'to bottom',
  'to-left': 'to left',
  'to-right': 'to right',
};

// The surface role each tint washes the blur with
const TintSurfaces: Record<BackdropTint, SurfaceColorToken> = {
  accent: 'accent',
};

// The tint opacity behind each strength, as a percentage
const TintOpacities: Record<BackdropTintStrength, number> = {
  subtle: 30,
  regular: 50,
  strong: 75,
};

/**
 * Emits CSS for a container style. The background image itself is
 * applied by the renderer, which resolves the media file path; only
 * its fit and backdrop treatment emit here.
 */
export function createContainerCss(
  style: ContainerStyle,
  parentDirection?: ContainerDirection,
): CSSProperties {
  const css: CSSProperties = {
    display: 'flex',
    flexDirection: style.direction ?? 'column',
    ...paddingCss(style),
    ...marginCss(style),
    ...borderCss(style),
    ...maxWidthCss(style),
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

  // The container fill, which flips the text inside it to the
  // contrasting colour when solid
  Object.assign(css, backgroundCss(style));

  Object.assign(css, containerHeightCss(style, parentDirection));

  return css;
}

/**
 * Emits the CSS a renderer applies to the backdrop overlay covering
 * a container's background image. Returns null when the container
 * has no backdrop effects.
 */
export function createBackdropCss(
  style: Pick<
    ContainerStyle,
    | 'backdropBlur'
    | 'backdropTint'
    | 'backdropTintStrength'
    | 'backdropBrightness'
    | 'backdropFade'
    | 'backdropFadeDirection'
    | 'backdropFadeStart'
    | 'backdropFadeExtent'
  >,
): CSSProperties | null {
  // Collect the active backdrop filters
  const filters: string[] = [];

  if (style.backdropBlur) {
    filters.push(`blur(${BackdropBlurAmounts[style.backdropBlur]})`);
  }

  // An unset brightness leaves the backdrop as it is, so only a
  // changed value emits a filter
  if (
    style.backdropBrightness !== undefined &&
    style.backdropBrightness !== 100
  ) {
    filters.push(`brightness(${style.backdropBrightness}%)`);
  }

  // No effects, no overlay
  if (filters.length === 0) {
    return null;
  }

  const filter = filters.join(' ');

  const css: CSSProperties = {
    backdropFilter: filter,
    WebkitBackdropFilter: filter,
  };

  // The tint washes the overlay with a translucent surface colour,
  // so it fades out with the rest of the effects
  if (style.backdropTint) {
    const surface = tokenCssVariable(
      'surfaceColor',
      TintSurfaces[style.backdropTint],
    );
    const opacity = TintOpacities[style.backdropTintStrength ?? 'regular'];

    css.backgroundColor = `color-mix(in srgb, ${surface} ${opacity}%, transparent)`;
  }

  // The fade masks the effects out across the overlay: full
  // strength up to the start, fully faded out by the extent
  if (style.backdropFade) {
    const direction = FadeDirections[style.backdropFadeDirection ?? 'to-top'];
    const start = style.backdropFadeStart ?? 0;
    const extent = style.backdropFadeExtent ?? 50;
    const mask = `linear-gradient(${direction}, black ${start}%, transparent ${extent}%)`;

    css.maskImage = mask;
    css.WebkitMaskImage = mask;
  }

  return css;
}

/**
 * Emits the height rules: a fixed height, or the floor and cap of
 * a content sized one. A bounded container scrolls what does not
 * fit, so content cannot draw past its surface.
 */
function containerHeightCss(
  style: ContainerStyle,
  parentDirection?: ContainerDirection,
): CSSProperties {
  const css: CSSProperties = { ...heightCss(style, parentDirection) };

  // Proportions take the height from the width, leaving the other
  // height rules nothing to apply to
  if (style.aspectRatio) {
    css.aspectRatio = resolveAspectRatio(style.aspectRatio);
    css.overflowX = 'hidden';
    css.overflowY = 'auto';

    return css;
  }

  // A fixed height leaves no room for a floor or a cap
  if (style.height && style.height !== 'fill') {
    css.overflowX = 'hidden';
    css.overflowY = 'auto';

    return css;
  }

  // A floor is what stops a filling container being squashed below
  // its content, so it applies while filling too
  if (style.minHeight) {
    css.minHeight = tokenCssVariable('size', style.minHeight);
  }

  if (style.maxHeight) {
    css.maxHeight = tokenCssVariable('size', style.maxHeight);
  }

  // A container held to a height scrolls whatever does not fit
  if (style.height === 'fill' || style.maxHeight) {
    css.overflowX = 'hidden';
    css.overflowY = 'auto';
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
