import { CSSProperties } from 'react';
import { MeasureToken, SpaceToken, contentColumnCss } from '@minddrop/designs';

/**
 * Returns the flex sizing style for a panelled page root's region
 * child: panels keep their fixed width, the content region fills
 * the remaining space, and both scroll the content they cannot
 * fit within the page height. Returns an empty object for any
 * other element.
 *
 * @param element - The element to size.
 * @param contentMaxWidth - The root's content width cap, applied to the content region.
 * @param contentPadding - The root's content padding, applied outside the cap.
 * @returns The flex sizing style.
 */
export function resolveRegionFlexStyle(
  element: {
    type: string;
    role?: string;
  },
  contentMaxWidth?: MeasureToken,
  contentPadding?: SpaceToken,
): CSSProperties {
  // Panels keep their fixed width and scroll independently
  if (element.type === 'page-panel') {
    return { flexShrink: 0, overflowY: 'auto' };
  }

  // The content region fills the remaining space and scrolls
  // independently of the panels, capped, padded and centred as the
  // root's content column
  if (element.type === 'container' && element.role === 'page-content') {
    return {
      flexGrow: 1,
      flexBasis: 0,
      minWidth: 0,
      overflowY: 'auto',
      marginLeft: 'auto',
      marginRight: 'auto',
      ...contentColumnCss(contentMaxWidth, contentPadding),
    };
  }

  return {};
}
