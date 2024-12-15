import { Element } from '../../types';

export interface UnorderedListItemElementData {
  /**
   * The nesting level of the unordered-list-item.
   */
  depth?: number;
}

export type UnorderedListItemElement = Element<
  'unordered-list-item',
  UnorderedListItemElementData
>;
