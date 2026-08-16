import { Element } from '../../types';

/**
 * An inline math expression. Its content is literal, held in a single text
 * child as the block level math element holds its own.
 */
export type InlineMathElement = Element<'inline-math'>;
