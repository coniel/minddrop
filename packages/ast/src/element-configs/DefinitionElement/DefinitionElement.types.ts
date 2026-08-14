import { Element } from '../../types';

export interface DefinitionElementData {
  /**
   * The normalized identifier references resolve against.
   */
  identifier: string;

  /**
   * The label as authored, which can differ from the identifier in case and
   * whitespace.
   */
  label?: string;

  /**
   * The destination the reference resolves to.
   */
  url: string;

  /**
   * The definition's optional title.
   */
  title?: string | null;
}

export type DefinitionElement = Element<'definition', DefinitionElementData>;
