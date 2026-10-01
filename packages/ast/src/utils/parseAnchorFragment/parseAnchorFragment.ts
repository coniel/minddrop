import { AnchorPrefix } from '../../constants';
import { isAnchorFragment } from '../isAnchorFragment';

/**
 * Parses the anchor ID out of a wikilink fragment, `^id`.
 *
 * @param fragment - The fragment, without the `#` which introduces it.
 * @returns The anchor ID, or null when the fragment is not an anchor.
 */
export function parseAnchorFragment(fragment: string): string | null {
  // Check the fragment names an anchor
  if (!isAnchorFragment(fragment)) {
    return null;
  }

  // Drop the prefix
  return fragment.slice(AnchorPrefix.length);
}
