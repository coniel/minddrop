import { uuid } from '@minddrop/utils';
import { BlockquoteFrame } from '../../types';

// The line prefix a new block quote is written with
const DefaultSyntax = '> ';

/**
 * Builds a new block quote frame.
 *
 * @returns The frame.
 */
export function generateBlockquoteFrame(): BlockquoteFrame {
  return { id: uuid(), kind: 'blockquote', syntax: DefaultSyntax };
}
