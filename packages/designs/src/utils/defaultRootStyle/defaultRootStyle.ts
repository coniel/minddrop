import { RootStyle } from '../../styles';
import { LayoutType } from '../../types';

/**
 * Resolves the default style values of a layout type's root:
 * full-screen types carry a content gutter, which stays
 * user-editable like any other style value. Seeded at creation and
 * restored by the studio's styling reset.
 */
export function defaultRootStyle(type?: LayoutType): RootStyle {
  // A page's content keeps a gutter from the screen edges
  if (type === 'page' || type === 'space') {
    return { contentPadding: '4' };
  }

  return {};
}
