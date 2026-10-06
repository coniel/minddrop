import { WikilinkPattern } from '../../constants';
import { Fragment, TextElement } from '../../types';
import { generateWikilinkElement, parseWikilinkMatch } from '../../utils';

/**
 * Splits the wikilinks out of a run of text.
 *
 * CommonMark has no wikilink, so remark reads the spelling as ordinary text
 * and the links are recovered from it here. The marks the text carries are
 * kept on the text around the links; a link's own label carries none, the
 * label being part of its spelling.
 *
 * @param text - The text node to split.
 * @returns The text and the wikilinks within it.
 */
export function parseWikilinks(text: TextElement): Fragment {
  const fragment: Fragment = [];
  const { text: value, ...marks } = text;
  let index = 0;

  // The pattern is global, so its state is carried between runs
  WikilinkPattern.lastIndex = 0;

  for (
    let match = WikilinkPattern.exec(value);
    match;
    match = WikilinkPattern.exec(value)
  ) {
    // Split the match into the link's parts
    const {
      reference,
      fragment: linkFragment,
      label,
    } = parseWikilinkMatch(match);

    // The text between the previous link and this one
    if (match.index > index) {
      fragment.push({ ...marks, text: value.slice(index, match.index) });
    }

    // Add the link. One written without a label shows its target.
    fragment.push(
      generateWikilinkElement(reference, { label, fragment: linkFragment }),
    );

    index = match.index + match[0].length;
  }

  // Text which held no links at all is returned as it was
  if (!fragment.length) {
    return [text];
  }

  // The text after the last link
  if (index < value.length) {
    fragment.push({ ...marks, text: value.slice(index) });
  }

  return fragment;
}
