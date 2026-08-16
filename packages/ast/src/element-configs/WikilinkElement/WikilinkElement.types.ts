import { Element } from '../../types';

export interface WikilinkElementData {
  /**
   * What the link points at, as written between the brackets. Usually a
   * title on its own, e.g. `Book`, and qualified when a title alone would
   * be ambiguous, e.g. `Books/Book`.
   *
   * The reference is not resolved here: what it names is decided by whoever
   * recognises it.
   */
  reference: string;
}

/**
 * A link written in the wikilink spelling, `[[Book]]` or `[[Books/Book|Book]]`.
 *
 * Markdown has no such construct: CommonMark reads the spelling as ordinary
 * text. It is modelled here so that the link can be rendered and followed,
 * and written back exactly as it was authored.
 *
 * The link's text is literal content held in a single text child, the label
 * being part of the spelling rather than prose which can carry marks.
 */
export type WikilinkElement = Element<'wikilink', WikilinkElementData>;
