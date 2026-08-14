import { Element } from '../../types';

export interface FootnoteReferenceElementData {
  /**
   * The normalized identifier the reference resolves against.
   */
  identifier: string;

  /**
   * The label as authored.
   */
  label?: string;
}

export type FootnoteReferenceElement = Element<
  'footnote-reference',
  FootnoteReferenceElementData
>;
