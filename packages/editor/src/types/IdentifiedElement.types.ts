import { Element } from '@minddrop/ast';

/**
 * An element carrying a block ID.
 *
 * Block IDs are session scoped: they are generated when the
 * markdown is parsed and are not serialized back into it.
 */
export type IdentifiedElement<TElement extends Element = Element> = TElement & {
  /**
   * The element's session scoped block ID.
   */
  id: string;
};
