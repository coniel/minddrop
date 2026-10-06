import { WikilinkElementData } from '../../element-configs';

export interface ParsedWikilink extends WikilinkElementData {
  /**
   * The label the link is written with, after the `|`.
   */
  label?: string;
}

/**
 * Parses the parts of a wikilink from a match of the wikilink pattern.
 *
 * @param match - The match of `WikilinkPattern`.
 * @returns The link's reference, fragment and label. A link written with an empty label has none.
 */
export function parseWikilinkMatch(match: RegExpMatchArray): ParsedWikilink {
  // Read the parts from the pattern's capture groups
  const [, reference, fragment, label] = match;

  return { reference, fragment, label: label || undefined };
}
