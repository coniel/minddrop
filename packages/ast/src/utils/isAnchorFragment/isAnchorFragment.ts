import { AnchorPrefix } from '../../constants';

/**
 * Checks whether a wikilink fragment names an anchor within its
 * target, `^id`, rather than a heading.
 *
 * @param fragment - The fragment, without the `#` which introduces it.
 * @returns Whether the fragment names an anchor.
 */
export function isAnchorFragment(fragment: string): boolean {
  return fragment.startsWith(AnchorPrefix) && fragment.length > 1;
}
