import { Element } from '../types';
import { generateTextElement } from './generateTextElement';

/**
 * Builds an element of the given type, defaulting its children to a
 * single empty text element.
 *
 * @param type - The element type.
 * @param data - Additional element data.
 * @returns The element.
 */
export function generateElement<TElement extends Element = Element>(
  type: TElement['type'],
  data?: Partial<TElement>,
): TElement {
  return {
    children: [generateTextElement()],
    ...data,
    type,
  } as TElement;
}
