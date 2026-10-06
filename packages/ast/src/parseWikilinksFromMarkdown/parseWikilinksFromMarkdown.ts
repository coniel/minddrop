import { WikilinkPattern } from '../constants';
import { WikilinkElementData } from '../element-configs';
import {
  parseWikilinkMatch,
  resolveMarkdownTextRunsOutsideCode,
} from '../utils';

/**
 * Parses the wikilinks out of a markdown document, in document order,
 * repeated links included. Skips links inside code.
 *
 * Does not return a link split across lines. Returns links inside raw
 * HTML, and inside indented code within a blockquote.
 *
 * @param markdown - The markdown document.
 * @returns The reference and fragment of each link.
 */
export function parseWikilinksFromMarkdown(
  markdown: string,
): WikilinkElementData[] {
  // Parse the links in each run of text outside code. Text either side of
  // a code span is in separate runs, so it is never read as one link.
  return resolveMarkdownTextRunsOutsideCode(markdown).flatMap((text) =>
    Array.from(text.matchAll(WikilinkPattern), (match) => {
      const { reference, fragment } = parseWikilinkMatch(match);

      return { reference, fragment };
    }),
  );
}
