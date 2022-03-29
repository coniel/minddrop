import { Core, ParentReference } from '@minddrop/core';
import { RichTextElement } from '../types';

/**
 * Does something useful.
 */
export function removeParentFromRichTextElement<
  TElement extends RichTextElement = RichTextElement,
>(core: Core, elementId: string, parents: ParentReference[]): void {
  // Remove the parents from the element
  // Dispatch a 'rich-text-elements:remove-parents' event
  // Return the updated element
}
