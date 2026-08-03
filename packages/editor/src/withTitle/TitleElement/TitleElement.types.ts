import { Element } from '@minddrop/ast';

/**
 * The element type of the enforced title block rendered as the
 * first node of editors with the title feature enabled.
 */
export const TITLE_ELEMENT_TYPE = 'title';

/**
 * The enforced title block element. Contains only plain text.
 */
export type TitleElement = Element<typeof TITLE_ELEMENT_TYPE>;
