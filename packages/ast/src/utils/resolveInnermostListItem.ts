import { Frame, ListItemFrame } from '../types';

/**
 * Returns the innermost list item a block sits inside, if any.
 *
 * @param ancestry - The block's ancestry.
 * @returns The innermost list item frame, or null.
 */
export function resolveInnermostListItem(
  ancestry: Frame[] = [],
): ListItemFrame | null {
  for (let index = ancestry.length - 1; index >= 0; index -= 1) {
    const frame = ancestry[index];

    if (frame.kind === 'list-item') {
      return frame;
    }
  }

  return null;
}
