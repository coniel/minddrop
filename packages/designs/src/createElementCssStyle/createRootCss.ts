import type { CSSProperties } from 'react';
import { ListRootSurfaceVariable } from '../constants';
import {
  BackgroundEmphasis,
  ContainerDirection,
  RootBackground,
  RootStyle,
} from '../styles';
import {
  MeasureToken,
  SpaceToken,
  SurfaceColorToken,
  tokenCssVariable,
} from '../tokens';
import { LayoutType } from '../types';
import { createContainerCss } from './createContainerCss';

/**
 * Emits CSS for a layout root style: the shared container blocks
 * with the semantic background treatment resolved to a surface
 * role. Unlike other styles, the background always emits, defaulting
 * per layout type, so a root never renders see-through over the
 * view behind it.
 */
export function createRootCss(
  style: RootStyle,
  parentDirection?: ContainerDirection,
  layoutType?: LayoutType,
): CSSProperties {
  // Split the semantic background and the content padding off the
  // shared container blocks
  const { background, emphasis, contentPadding, ...containerStyle } = style;

  // The shared container layout, spacing, border and size blocks
  const css = createContainerCss(containerStyle, parentDirection);

  // A panelled root is a row of regions: its width cap and content
  // padding belong to the content region rather than the row itself
  if (containerStyle.direction === 'row') {
    delete css.maxWidth;
  } else {
    Object.assign(
      css,
      contentColumnCss(containerStyle.maxWidth, contentPadding),
    );
  }

  // Apply the defaults: an unset background takes the layout
  // type's treatment, an unset emphasis is subtle
  const treatment = background ?? defaultRootBackground(layoutType);
  const level = emphasis ?? 'subtle';

  // The treatment's surface at the emphasis level
  const surface = tokenCssVariable(
    'surfaceColor',
    resolveRootSurface(treatment, level),
  );

  // Apply the surface, with a list root taking its colour through a
  // variable so the rendering context can swap it per row state
  css.backgroundColor =
    layoutType === 'list'
      ? `var(${ListRootSurfaceVariable}, ${surface})`
      : surface;

  // A solid fill needs the contrasting text colour to stay readable
  if (treatment !== 'transparent' && level === 'solid') {
    css.color = tokenCssVariable('textColor', 'on-solid');
  }

  return css;
}

/**
 * Emits the CSS of a page's content column: centred, capped at the
 * content width, and padded outside the cap so the padding only
 * insets the content when the page is too narrow to give the cap
 * its full measure. Applied to the root itself, or to the content
 * region of a panelled root.
 */
export function contentColumnCss(
  maxWidth?: MeasureToken,
  contentPadding?: SpaceToken,
): CSSProperties {
  const css: CSSProperties = {};

  // Cap the column at its measure
  if (maxWidth) {
    css.maxWidth = tokenCssVariable('measure', maxWidth);
  }

  // Pad the column's sides
  if (contentPadding) {
    const padding = tokenCssVariable('space', contentPadding);

    css.paddingLeft = padding;
    css.paddingRight = padding;

    // Widen the cap by the padding, so the content keeps its full
    // measure while the page has the room for it
    if (maxWidth) {
      css.maxWidth = `calc(${tokenCssVariable('measure', maxWidth)} + 2 * ${padding})`;
    }
  }

  // Centre the capped column within the page
  if (maxWidth) {
    css.marginLeft = 'auto';
    css.marginRight = 'auto';
  }

  return css;
}

/**
 * Resolves the treatment an unset root background defaults to:
 * transparent for the full-screen page and space types, the subtle
 * surface for the floating card and list types.
 */
function defaultRootBackground(layoutType?: LayoutType): RootBackground {
  // Full-screen roots blend into the surface they fill
  if (layoutType === 'page' || layoutType === 'space') {
    return 'transparent';
  }

  return 'accent';
}

// The surface role behind each emphasis step of a coloured root
const RootSurfaces: Record<BackgroundEmphasis, SurfaceColorToken> = {
  subtle: 'subtle',
  regular: 'accent',
  solid: 'solid-accent',
};

/**
 * Maps a background treatment and emphasis level onto the surface
 * colour token carrying that look. The transparent treatment always
 * paints the surface views render on; the accent treatment picks a
 * step off the schemable surface roles per level.
 */
function resolveRootSurface(
  background: RootBackground,
  emphasis: BackgroundEmphasis,
): SurfaceColorToken {
  // Transparent roots blend into the view, with no strength to vary
  if (background === 'transparent') {
    return 'app';
  }

  return RootSurfaces[emphasis];
}
