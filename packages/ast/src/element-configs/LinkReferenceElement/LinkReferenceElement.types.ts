import { Element } from '../../types';

/**
 * How the reference was authored: `full` is `[text][ref]`, `collapsed` is
 * `[ref][]` and `shortcut` is `[ref]`.
 */
export type ReferenceType = 'full' | 'collapsed' | 'shortcut';

export interface LinkReferenceElementData {
  /**
   * The normalized identifier the reference resolves against.
   */
  identifier: string;

  /**
   * The label as authored.
   */
  label?: string;

  /**
   * The reference's authored form.
   */
  referenceType: ReferenceType;
}

export type LinkReferenceElement = Element<
  'link-reference',
  LinkReferenceElementData
>;
