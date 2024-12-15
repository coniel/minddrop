import { Element } from '../../types';

export interface HeadingElementData {
  /**
   * The heading level.
   */
  level: 1 | 2 | 3 | 4 | 5 | 6;

  /**
   * The markdowm syntax used to create the heading.
   *
   * Heading 1 and 2 can be created using the alternative markdown
   * syntax of a line of equal signs or dashes respectively.
   */
  syntax?: '#' | '=' | '-';
}

export type HeadingElement = Element<'heading', HeadingElementData>;
