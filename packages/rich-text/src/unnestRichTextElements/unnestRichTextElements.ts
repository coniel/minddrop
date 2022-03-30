import { Core, ParentReferences } from '@minddrop/core';
import { FieldValue } from '@minddrop/utils';
import { removeParentsFromRichTextElement } from '../removeParentsFromRichTextElement';
import { RichTextBlockElement } from '../types';
import { updateRichTextElement } from '../updateRichTextElement';

/**
 * Unnests rich text block elements from another rich text
 * block element and dispatches a `rich-text-elements:unnest`
 * event. Returns the updated element.
 *
 * - Throws a `RichTextElementNotFoundError` if the element
 *   or any of the nested elements do not exist.
 *
 * @param core A MindDrop core instance.
 * @param elementId The ID of the element from which to unnest elements.
 * @param unnestElementIds The IDs of the elements to unnest.
 * @returns The updated element.
 */
export function unnestRichTextElements<
  TElement extends RichTextBlockElement = RichTextBlockElement,
>(core: Core, elementId: string, unnestElementIds: string[]): TElement {
  // Remove the unnested element IDs from the element
  const element = updateRichTextElement<TElement>(core, elementId, {
    nestedElements: FieldValue.arrayRemove(unnestElementIds),
  });

  // Remove the element as a parent from the nested elements
  unnestElementIds.forEach((id) => {
    removeParentsFromRichTextElement(core, id, [
      ParentReferences.generate('rich-text-element', elementId),
    ]);
  });

  // Dispatch a 'rich-text-elements:unnest'
  core.dispatch('rich-text-elements:unnest', {
    element,
    unnestedElements: unnestElementIds,
  });

  // Return the updated element
  return element;
}
