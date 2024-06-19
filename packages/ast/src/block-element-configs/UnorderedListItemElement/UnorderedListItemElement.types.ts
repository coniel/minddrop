import { TextBlockElement } from '../../types';

export interface UnorderedListItemElementData {
  /**
   * The nesting level of the unordered-list-item.
   */
  depth?: number;
}

export type UnorderedListItemElement = TextBlockElement<
  'unordered-list-item',
  UnorderedListItemElementData
>;
