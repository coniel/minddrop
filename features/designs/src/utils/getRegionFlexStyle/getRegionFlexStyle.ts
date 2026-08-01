import { CSSProperties } from 'react';

/**
 * Returns the flex sizing style for a panelled page root's region
 * child: panels keep their fixed width, the content region fills
 * the remaining space. Returns an empty object for any other
 * element.
 *
 * @param element - The element to size.
 * @returns The flex sizing style.
 */
export function getRegionFlexStyle(element: {
  type: string;
  role?: string;
}): CSSProperties {
  if (element.type === 'page-panel') {
    return { flexShrink: 0 };
  }

  if (element.type === 'container' && element.role === 'content') {
    return { flexGrow: 1, flexBasis: 0, minWidth: 0 };
  }

  return {};
}
