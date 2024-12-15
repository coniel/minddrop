import { Element } from '../types';
import { TextElement } from '../types/TextElement.types';

export function generateTextElement(
  text = '',
  marks: Omit<TextElement, 'text'> = {},
): TextElement {
  return {
    ...marks,
    text,
  };
}

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
