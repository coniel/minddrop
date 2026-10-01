import { AnchorPrefix } from '../../constants';

/**
 * Resolves the wikilink fragment naming an anchor, `^id`.
 *
 * @param id - The anchor ID.
 * @returns The fragment, without the `#` which introduces it.
 */
export function resolveAnchorFragment(id: string): string {
  return `${AnchorPrefix}${id}`;
}
